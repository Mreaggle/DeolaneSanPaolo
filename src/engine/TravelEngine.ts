import type { GameContent } from '../content';

export const travelHours = (content: GameContent, fromCityId: string, toCityId: string, recoveryCityId?: string): number => {
  const edge = content.connections.find((candidate) => candidate.fromCityId === fromCityId && candidate.toCityId === toCityId);
  if (edge) return edge.travelHours;
  if (toCityId === recoveryCityId) return 5;
  throw new Error('INVALID_DESTINATION');
};

