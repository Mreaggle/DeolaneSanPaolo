import { traitClueTexts, traitLabels, traitValueLabels, type GameContent, type RankId, type TraitCategory } from '../content';
import type { CaseDefinition, DetectiveProfile, GeneratedCityDefinition, GeneratedClue, GeneratedPlaceDefinition } from '../engine/types';
import { rankForSolvedCases } from '../engine/ProgressionEngine';
import { DEADLINE_HOURS } from '../engine/TimeEngine';
import { SeededRng } from './rng/SeededRng';
import { validateCase } from './CaseValidator';

const categories: readonly TraitCategory[] = ['sex', 'hair', 'hobby', 'feature', 'vehicle'];

const combinations = <T>(values: readonly T[], count: number): T[][] => {
  if (count === 0) return [[]];
  return values.flatMap((value, index) => combinations(values.slice(index + 1), count - 1).map((tail) => [value, ...tail]));
};

const identityCategoriesFor = (culpritId: string, content: GameContent): readonly TraitCategory[] => {
  const culprit = content.suspects.find((suspect) => suspect.id === culpritId)!;
  for (let size = 3; size <= categories.length; size += 1) {
    for (const candidate of combinations(categories, size)) {
      const matches = content.suspects.filter((suspect) => candidate.every((category) => suspect.traits[category] === culprit.traits[category]));
      if (matches.length === 1) return candidate;
    }
  }
  return categories;
};

const buildAdjacency = (content: GameContent): Map<string, readonly string[]> => {
  const map = new Map<string, string[]>();
  for (const city of content.cities) map.set(city.id, []);
  for (const edge of content.connections) map.get(edge.fromCityId)!.push(edge.toCityId);
  return map;
};

const routeFrom = (start: string, length: number, adjacency: Map<string, readonly string[]>, rng: SeededRng): readonly string[] | undefined => {
  const route = [start];
  const extend = (): boolean => {
    if (route.length === length) return true;
    for (const next of rng.shuffle(adjacency.get(route.at(-1)!) ?? [])) {
      if (route.includes(next)) continue;
      route.push(next);
      if (extend()) return true;
      route.pop();
    }
    return false;
  };
  return extend() ? route : undefined;
};

const regionLabels: Readonly<Record<string, string>> = {
  'north-america': 'na América do Norte',
  'south-america': 'na América do Sul',
  europe: 'na Europa',
  africa: 'na África',
  'middle-east': 'no Oriente Médio',
  asia: 'na Ásia',
  oceania: 'na Oceania'
};

interface BroadGeographicClue {
  text: string;
  compatibleCityIds: readonly string[];
}

const broadGeographicClue = (
  targetCityId: string,
  travelCandidates: readonly string[],
  content: GameContent
): BroadGeographicClue => {
  const target = content.cities.find((city) => city.id === targetCityId)!;
  const candidates = travelCandidates.map((cityId) => content.cities.find((city) => city.id === cityId)!);
  const sameRegion = candidates.filter((city) => city.region === target.region).map((city) => city.id);
  return sameRegion.length >= 2 ? {
    text: `Comentaram que a próxima parada ficava ${regionLabels[target.region]}.`,
    compatibleCityIds: sameRegion
  } : {
    text: 'A pessoa confirmou que cruzaria uma fronteira internacional antes da próxima parada.',
    compatibleCityIds: travelCandidates
  };
};

const factIndexesByRank: Readonly<Record<RankId, readonly number[]>> = {
  rookie: [0, 1, 2],
  sleuth: [1, 0, 2],
  'private-eye': [1, 2, 0],
  investigator: [2, 1, 0],
  'ace-detective': [2, 1, 0]
};

export const generateCase = (profile: DetectiveProfile, seed: string, content: GameContent): CaseDefinition => {
  const rank = rankForSolvedCases(profile.solvedCases);
  const caseType = profile.solvedCases === 13 && !profile.deolaneCaptured ? 'FINAL_DEOLANE' : 'STANDARD';
  const rng = new SeededRng(seed);
  const ordinaryCulprits = content.suspects.filter((suspect) => !suspect.isMastermind && suspect.id !== profile.recentCulpritIds[0]);
  const preferredCulprits = ordinaryCulprits.filter((suspect) => !profile.recentCulpritIds.slice(0, 2).includes(suspect.id));
  const culpritPool = preferredCulprits.length ? preferredCulprits : ordinaryCulprits;
  const culprit = caseType === 'FINAL_DEOLANE'
    ? content.suspects.find((suspect) => suspect.isMastermind)!
    : rng.pick(culpritPool);
  const adjacency = buildAdjacency(content);
  const freshStarts = content.cities.filter((city) => !profile.recentStartCityIds.slice(0, 3).includes(city.id));
  const startCandidates = rng.shuffle(freshStarts.length ? freshStarts : content.cities.filter((city) => city.id !== profile.recentStartCityIds[0]));
  let route: readonly string[] | undefined;
  for (const start of startCandidates) {
    route = routeFrom(start.id, rank.routeLength, adjacency, rng);
    if (route) break;
  }
  if (!route) throw new Error('GENERATION_FAILED: route');

  const identityCategories = identityCategoriesFor(culprit.id, content);
  const cityDefinitions: Record<string, GeneratedCityDefinition> = {};
  let identityCursor = 0;
  for (let routeIndex = 0; routeIndex < route.length; routeIndex += 1) {
    const cityId = route[routeIndex]!;
    const city = content.cities.find((candidate) => candidate.id === cityId)!;
    const selectedPlaces = rng.shuffle(city.allowedPlaceIds).slice(0, 3);
    if (routeIndex === route.length - 1) {
      cityDefinitions[cityId] = {
        cityId,
        places: selectedPlaces.map((placeId, placeIndex) => ({
          placeId,
          witnessId: rng.pick(content.places.find((place) => place.id === placeId)!.witnesses).id,
          clue: { id: `${seed}:${cityId}:${placeIndex}`, family: 'final-proximity', text: 'Você chegou perto. Há sinais de que o suspeito ainda está nesta cidade.' }
        })),
        travelCandidates: []
      };
      continue;
    }
    const targetCityId = route[routeIndex + 1]!;
    const neighbours = adjacency.get(cityId) ?? [];
    const decoys = rng.shuffle(neighbours.filter((candidate) => candidate !== targetCityId));
    const travelCandidates = rng.shuffle([targetCityId, ...decoys.slice(0, Math.max(0, rank.travelChoices - 1))]);
    const targetCity = content.cities.find((candidate) => candidate.id === targetCityId)!;
    const broadClue = broadGeographicClue(targetCityId, travelCandidates, content);
    const category = identityCursor < identityCategories.length ? identityCategories[identityCursor++] : undefined;
    const trait = category ? culprit.traits[category] : undefined;
    const cluePayloads: GeneratedClue[] = [
      {
        id: '',
        family: 'geographic',
        text: broadClue.text,
        targetCityId,
        compatibleCityIds: broadClue.compatibleCityIds
      }
    ];
    const specificFactCount = category ? 1 : 2;
    for (const factIndex of factIndexesByRank[rank.id].slice(0, specificFactCount)) {
      const fact = targetCity.facts[factIndex]!;
      cluePayloads.push({
        id: '',
        family: 'geographic',
        text: fact.text,
        targetCityId,
        compatibleCityIds: fact.compatibleCityIds.filter((cityId) => travelCandidates.includes(cityId))
      });
    }
    if (category && trait) {
      cluePayloads.push({
        id: '',
        family: 'identity',
        text: traitClueTexts[trait] ?? `A testemunha observou ${traitLabels[category].toLowerCase()}: ${traitValueLabels[trait]?.toLowerCase() ?? trait.replaceAll('-', ' ')}.`,
        targetTraitCategory: category,
        targetTraitValue: trait
      });
    }
    const shuffledPayloads = rng.shuffle(cluePayloads);
    const placeDefinitions: GeneratedPlaceDefinition[] = selectedPlaces.map((placeId, placeIndex) => {
      const clue = shuffledPayloads[placeIndex]!;
      return {
        placeId,
        witnessId: rng.pick(content.places.find((place) => place.id === placeId)!.witnesses).id,
        clue: {
          ...clue,
          id: `${seed}:${cityId}:${placeIndex}`
        }
      };
    });
    cityDefinitions[cityId] = { cityId, places: placeDefinitions, travelCandidates };
  }
  const finalCityId = route.at(-1)!;
  const finalHideoutPlaceId = rng.pick(cityDefinitions[finalCityId]!.places).placeId;
  const startCity = content.cities.find((city) => city.id === route![0])!;
  const compatibleItems = content.stolenItems.filter((item) =>
    item.compatibleCityIds?.includes(startCity.id) || item.compatibleRegionIds?.includes(startCity.region)
  );
  const freshItems = compatibleItems.filter((item) => !profile.recentStolenItemIds.slice(0, 3).includes(item.id));
  const stolenItemId = rng.pick(freshItems.length ? freshItems : compatibleItems).id;
  const definition: CaseDefinition = {
    id: `DSP-${seed}`,
    seed,
    generationVersion: 2,
    contentVersion: content.contentVersion,
    caseType,
    rankId: rank.id as RankId,
    culpritId: culprit.id,
    stolenItemId,
    route,
    cities: cityDefinitions,
    finalCityId,
    finalHideoutPlaceId,
    deadlineHour: DEADLINE_HOURS
  };
  const failures = validateCase(definition, content);
  if (failures.length) throw new Error(`GENERATION_FAILED: ${failures.join(', ')}`);
  return definition;
};
