import { traitClueTexts, traitClueVariants, traitLabels, traitValueLabels, type GameContent, type RankId, type TraitCategory } from '../content';
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
  const matchCount = (category: TraitCategory): number => content.suspects.filter((suspect) => suspect.traits[category] === culprit.traits[category]).length;
  const identifying: TraitCategory[][] = [];
  for (let size = 3; size <= categories.length; size += 1) {
    for (const candidate of combinations(categories, size)) {
      const matches = content.suspects.filter((suspect) => candidate.every((category) => suspect.traits[category] === culprit.traits[category]));
      if (matches.length === 1) identifying.push(candidate);
    }
    if (identifying.length) break;
  }
  const rankCandidates = (candidates: TraitCategory[][]) => candidates.sort((left, right) => {
    const uniqueDifference = left.filter((category) => matchCount(category) === 1).length - right.filter((category) => matchCount(category) === 1).length;
    if (uniqueDifference) return uniqueDifference;
    return right.reduce((total, category) => total + matchCount(category), 0) - left.reduce((total, category) => total + matchCount(category), 0);
  });
  const sharedOnly = rankCandidates(identifying.filter((candidate) => candidate.every((category) => matchCount(category) > 1)))[0];
  const shorterShared = combinations(categories, 2).find((candidate) =>
    candidate.every((category) => matchCount(category) > 1)
    && content.suspects.filter((suspect) => candidate.every((category) => suspect.traits[category] === culprit.traits[category])).length === 1
  );
  const selected = sharedOnly ?? shorterShared ?? rankCandidates(identifying)[0] ?? [...categories];
  return [...selected].sort((left, right) => matchCount(right) - matchCount(left));
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
  currentCityId: string,
  targetCityId: string,
  travelCandidates: readonly string[],
  content: GameContent,
  rng: SeededRng
): BroadGeographicClue => {
  const current = content.cities.find((city) => city.id === currentCityId)!;
  const target = content.cities.find((city) => city.id === targetCityId)!;
  const candidates = travelCandidates.map((cityId) => content.cities.find((city) => city.id === cityId)!);
  const clues: BroadGeographicClue[] = [];
  const add = (text: string, matching: readonly typeof candidates[number][]) => {
    const compatibleCityIds = matching.map((city) => city.id);
    if (compatibleCityIds.includes(targetCityId) && compatibleCityIds.length >= 2 && compatibleCityIds.length < travelCandidates.length) {
      clues.push({ text, compatibleCityIds });
    }
  };

  add(`Comentaram que a próxima parada ficava ${regionLabels[target.region]}.`, candidates.filter((city) => city.region === target.region));
  const targetNorth = target.coordinates.y < .5;
  add(`O itinerário mencionava uma cidade ${targetNorth ? 'ao norte' : 'ao sul'} da linha do Equador.`, candidates.filter((city) => (city.coordinates.y < .5) === targetNorth));
  const targetEastward = target.coordinates.x > current.coordinates.x;
  add(`A rota aérea seguia para ${targetEastward ? 'leste' : 'oeste'} a partir de ${current.name}.`, candidates.filter((city) => (city.coordinates.x > current.coordinates.x) === targetEastward));
  const targetSouthward = target.coordinates.y > current.coordinates.y;
  add(`O próximo trecho seguia para ${targetSouthward ? 'sul' : 'norte'} a partir de ${current.name}.`, candidates.filter((city) => (city.coordinates.y > current.coordinates.y) === targetSouthward));

  for (const pivot of candidates.filter((city) => city.id !== targetCityId)) {
    const targetEastOfPivot = target.coordinates.x > pivot.coordinates.x;
    add(`Um mapa anotado indicava uma cidade mais a ${targetEastOfPivot ? 'leste' : 'oeste'} que ${pivot.name}.`, candidates.filter((city) => (city.coordinates.x > pivot.coordinates.x) === targetEastOfPivot));
    const targetSouthOfPivot = target.coordinates.y > pivot.coordinates.y;
    add(`A anotação situava a parada mais ao ${targetSouthOfPivot ? 'sul' : 'norte'} que ${pivot.name}.`, candidates.filter((city) => (city.coordinates.y > pivot.coordinates.y) === targetSouthOfPivot));
  }

  if (!clues.length) throw new Error(`GENERATION_FAILED: no meaningful broad clue for ${currentCityId}->${targetCityId}`);
  return rng.pick(clues);
};

const factDifficultyWeights: Readonly<Record<RankId, Readonly<Record<'easy' | 'medium' | 'hard', number>>>> = {
  rookie: { easy: 4, medium: 3, hard: 1 },
  sleuth: { easy: 3, medium: 4, hard: 2 },
  'private-eye': { easy: 2, medium: 4, hard: 3 },
  investigator: { easy: 1, medium: 3, hard: 4 },
  'ace-detective': { easy: 1, medium: 2, hard: 5 }
};

const usefulForCandidates = (fact: GameContent['cities'][number]['facts'][number], targetCityId: string, travelCandidates: readonly string[]): boolean => {
  const compatible = fact.compatibleCityIds.filter((cityId) => travelCandidates.includes(cityId));
  return compatible.includes(targetCityId) && compatible.length < travelCandidates.length;
};

const factsLeaveOnlyTarget = (
  facts: readonly GameContent['cities'][number]['facts'][number][],
  broadCompatibleCityIds: readonly string[],
  targetCityId: string,
  travelCandidates: readonly string[]
): boolean => travelCandidates.filter((candidate) =>
  broadCompatibleCityIds.includes(candidate) && facts.every((fact) => fact.compatibleCityIds.includes(candidate))
).every((candidate) => candidate === targetCityId)
  && facts.every((fact) => fact.compatibleCityIds.includes(targetCityId));

const weightedFacts = (
  facts: readonly GameContent['cities'][number]['facts'][number][],
  rankId: RankId
): GameContent['cities'][number]['facts'][number][] => facts.flatMap((fact) =>
  Array.from({ length: factDifficultyWeights[rankId][fact.difficulty] }, () => fact)
);

const selectSpecificFacts = (
  targetFacts: readonly GameContent['cities'][number]['facts'][number][],
  count: number,
  broadCompatibleCityIds: readonly string[],
  targetCityId: string,
  travelCandidates: readonly string[],
  rankId: RankId,
  rng: SeededRng
): readonly GameContent['cities'][number]['facts'][number][] => {
  const useful = targetFacts.filter((fact) => usefulForCandidates(fact, targetCityId, travelCandidates));
  const flag = useful.find((fact) => fact.category === 'flag');
  const flagEligible = flag && (count > 1 || factsLeaveOnlyTarget([flag], broadCompatibleCityIds, targetCityId, travelCandidates))
    ? flag
    : undefined;
  const firstPool = count === 1
    ? useful.filter((fact) => factsLeaveOnlyTarget([fact], broadCompatibleCityIds, targetCityId, travelCandidates))
    : useful;
  const first = flagEligible && rng.next() < .4
    ? flagEligible
    : rng.pick(weightedFacts(firstPool, rankId));
  if (count === 1) return [first];

  const secondPool = useful.filter((fact) =>
    fact.id !== first.id && factsLeaveOnlyTarget([first, fact], broadCompatibleCityIds, targetCityId, travelCandidates)
  );
  return [first, rng.pick(weightedFacts(secondPool, rankId))];
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
    const decoys = rng.shuffle(neighbours.filter((candidate) => candidate !== targetCityId && candidate !== route.at(-1)));
    const travelCandidates = rng.shuffle([targetCityId, ...decoys.slice(0, Math.max(0, rank.travelChoices - 1))]);
    const targetCity = content.cities.find((candidate) => candidate.id === targetCityId)!;
    const broadClue = broadGeographicClue(cityId, targetCityId, travelCandidates, content, rng);
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
    const specificFacts = selectSpecificFacts(
      targetCity.facts,
      specificFactCount,
      broadClue.compatibleCityIds,
      targetCityId,
      travelCandidates,
      rank.id,
      rng
    );
    for (const fact of specificFacts) {
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
        text: rng.pick(traitClueVariants[trait] ?? [traitClueTexts[trait] ?? `Eu observei ${traitLabels[category].toLowerCase()}: ${traitValueLabels[trait]?.toLowerCase() ?? trait.replaceAll('-', ' ')}.`]),
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
    generationVersion: 5,
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
