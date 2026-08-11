import { traitLabels, traitValueLabels, type GameContent, type RankId, type TraitCategory } from '../content';
import type { CaseDefinition, DetectiveProfile, GeneratedCityDefinition, GeneratedPlaceDefinition } from '../engine/types';
import { rankForSolvedCases } from '../engine/ProgressionEngine';
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

export const generateCase = (profile: DetectiveProfile, seed: string, content: GameContent): CaseDefinition => {
  const rank = rankForSolvedCases(profile.solvedCases);
  const caseType = profile.solvedCases === 13 && !profile.deolaneCaptured ? 'FINAL_DEOLANE' : 'STANDARD';
  const rng = new SeededRng(seed);
  const eligibleCulprits = caseType === 'FINAL_DEOLANE'
    ? content.suspects.filter((suspect) => suspect.isMastermind)
    : content.suspects.filter((suspect) => !suspect.isMastermind && suspect.id !== profile.recentCulpritIds[0]);
  const preferredCulprits = eligibleCulprits.filter((suspect) => !profile.recentCulpritIds.slice(0, 2).includes(suspect.id));
  const culpritPool = preferredCulprits.length ? preferredCulprits : eligibleCulprits;
  const culprit = rng.pick(culpritPool);
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
    const target = content.cities.find((candidate) => candidate.id === targetCityId)!;
    const neighbours = adjacency.get(cityId) ?? [];
    const decoys = rng.shuffle(neighbours.filter((candidate) => candidate !== targetCityId));
    const travelCandidates = rng.shuffle([targetCityId, ...decoys.slice(0, Math.max(0, rank.travelChoices - 1))]);
    const placeDefinitions: GeneratedPlaceDefinition[] = selectedPlaces.map((placeId, placeIndex) => {
      const fact = target.facts[placeIndex % target.facts.length]!;
      const category = identityCursor < identityCategories.length && placeIndex === (routeIndex % 3)
        ? identityCategories[identityCursor++]
        : undefined;
      const trait = category ? culprit.traits[category] : undefined;
      const identityText = category && trait ? ` A pessoa também revelou ${traitLabels[category].toLowerCase()}: ${traitValueLabels[trait]?.toLowerCase() ?? trait.replaceAll('-', ' ')}.` : '';
      return {
        placeId,
        witnessId: rng.pick(content.places.find((place) => place.id === placeId)!.witnesses).id,
        clue: {
          id: `${seed}:${cityId}:${placeIndex}`,
          family: category ? 'identity' : 'geographic',
          text: `${fact.text}${identityText}`,
          targetCityId,
          ...(category && trait ? { targetTraitCategory: category, targetTraitValue: trait } : {})
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
    generationVersion: 1,
    contentVersion: content.contentVersion,
    caseType,
    rankId: rank.id as RankId,
    culpritId: culprit.id,
    stolenItemId,
    route,
    cities: cityDefinitions,
    finalCityId,
    finalHideoutPlaceId,
    deadlineHour: 120
  };
  const failures = validateCase(definition, content);
  if (failures.length) throw new Error(`GENERATION_FAILED: ${failures.join(', ')}`);
  return definition;
};
