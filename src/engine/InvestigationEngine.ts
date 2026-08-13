import type { CaseDefinition, CaseRuntimeState, GeneratedCityDefinition } from './types';
import { investigationCost, REVIEW_COST } from './TimeEngine';

export const locationKey = (cityId: string, placeId: string): string => `${cityId}:${placeId}`;

export const resolveInvestigation = (
  definition: CaseDefinition,
  runtime: CaseRuntimeState,
  city: GeneratedCityDefinition,
  placeId: string
) => {
  const place = city.places.find((candidate) => candidate.placeId === placeId);
  if (!place) throw new Error('INVALID_PLACE');
  const key = locationKey(runtime.currentCityId, placeId);
  const reviewed = runtime.visitedLocationKeys.includes(key);
  return {
    place,
    key,
    reviewed,
    timeCost: reviewed ? REVIEW_COST : investigationCost(runtime.investigationsThisVisit),
    finalEncounter: runtime.currentCityId === definition.finalCityId && placeId === definition.finalHideoutPlaceId
  };
};
