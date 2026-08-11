import type { RankDefinition } from '../types';

export const ranks: readonly RankDefinition[] = [
  { id: 'rookie', name: 'Novato', minSolved: 0, routeLength: 4, travelChoices: 3 },
  { id: 'sleuth', name: 'Detetive', minSolved: 1, routeLength: 5, travelChoices: 3 },
  { id: 'private-eye', name: 'Investigador Particular', minSolved: 4, routeLength: 6, travelChoices: 4 },
  { id: 'investigator', name: 'Inspetor', minSolved: 7, routeLength: 7, travelChoices: 4 },
  { id: 'ace-detective', name: 'Detetive Ás', minSolved: 10, routeLength: 8, travelChoices: 5 }
];

