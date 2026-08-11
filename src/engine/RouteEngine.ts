import type { ArrivalClassification, CaseDefinition, CaseRuntimeState } from './types';

export const classifyDestination = (definition: CaseDefinition, runtime: CaseRuntimeState, destination: string): ArrivalClassification => {
  if (destination === definition.route[runtime.furthestRouteIndex + 1]) {
    return destination === definition.finalCityId ? 'FINAL_CITY' : 'CORRECT_FORWARD';
  }
  if (destination === runtime.trailAnchorCityId) return 'TRAIL_ANCHOR';
  const routeIndex = definition.route.indexOf(destination);
  if (routeIndex >= 0 && routeIndex < runtime.furthestRouteIndex) return 'OLD_ROUTE_CITY';
  return 'WRONG_CITY';
};

