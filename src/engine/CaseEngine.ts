import type { DetectiveProfile, GameState } from './types';

export const createProfile = (name: string): DetectiveProfile => {
  const normalized = name.trim().slice(0, 14);
  if (!normalized) throw new Error('INVALID_PROFILE_NAME');
  return {
    id: normalized.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
    name: normalized,
    solvedCases: 0,
    failedCases: 0,
    deolaneCaptured: false,
    hallOfFame: false,
    recentCulpritIds: [],
    recentStartCityIds: [],
    recentStolenItemIds: []
  };
};

export const initialState = (profile: DetectiveProfile): GameState => ({ schemaVersion: 1, profile });

