import type { GameContent } from '../content';
import { matchSuspects } from '../engine/WarrantEngine';
import type { CaseDefinition, WarrantInput } from '../engine/types';

export const validateCase = (definition: CaseDefinition, content: GameContent): readonly string[] => {
  const failures: string[] = [];
  const rank = content.ranks.find((candidate) => candidate.id === definition.rankId)!;
  if (definition.route.length !== rank.routeLength) failures.push('route length');
  if (new Set(definition.route).size !== definition.route.length) failures.push('duplicate route city');
  if (definition.finalCityId !== definition.route.at(-1)) failures.push('final city');
  for (let index = 0; index < definition.route.length - 1; index += 1) {
    const cityId = definition.route[index]!;
    const nextId = definition.route[index + 1]!;
    const city = definition.cities[cityId];
    if (!city || city.places.length !== 3) failures.push(`places:${cityId}`);
    if (!city?.travelCandidates.includes(nextId)) failures.push(`candidate:${cityId}`);
    if (city && city.travelCandidates.length !== rank.travelChoices) failures.push(`candidate-count:${cityId}`);
    const geo = city?.places.filter((place) => place.clue.targetCityId === nextId).length ?? 0;
    if (geo < 2) failures.push(`geo:${cityId}`);
  }
  const evidence: WarrantInput = {};
  for (const city of Object.values(definition.cities)) {
    for (const place of city.places) {
      const clue = place.clue;
      if (clue.targetTraitCategory && clue.targetTraitValue) evidence[clue.targetTraitCategory] = clue.targetTraitValue;
    }
  }
  const matches = matchSuspects(content.suspects, evidence);
  if (matches.length !== 1 || matches[0] !== definition.culpritId) failures.push('identity');
  const startCity = content.cities.find((city) => city.id === definition.route[0])!;
  const item = content.stolenItems.find((candidate) => candidate.id === definition.stolenItemId);
  if (!item || !(item.compatibleCityIds?.includes(startCity.id) || item.compatibleRegionIds?.includes(startCity.region))) failures.push('item-compatibility');
  const travel = definition.route.slice(0, -1).reduce((total, from, index) => {
    const to = definition.route[index + 1]!;
    return total + (content.connections.find((edge) => edge.fromCityId === from && edge.toCityId === to)?.travelHours ?? 999);
  }, 0);
  const bestReasonableHours = (definition.route.length - 1) * 2 + travel + 2 + 2;
  const maximum = definition.rankId === 'ace-detective' ? 105 : 100;
  if (bestReasonableHours > maximum) failures.push(`time-margin:${bestReasonableHours}`);
  return failures;
};
