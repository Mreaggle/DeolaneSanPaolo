import { ranks, suspects } from '../content';
import type { DetectiveProfile } from './types';

export const rankForSolvedCases = (solvedCases: number) => {
  const eligible = ranks.filter((rank) => solvedCases >= rank.minSolved);
  return eligible[eligible.length - 1] ?? ranks[0]!;
};

export const applySolvedCase = (profile: DetectiveProfile, culpritId: string, startCityId: string, itemId: string): { profile: DetectiveProfile; promoted: boolean } => {
  const before = rankForSolvedCases(profile.solvedCases).id;
  const solvedCases = profile.solvedCases + 1;
  const mastermind = suspects.find((candidate) => candidate.id === culpritId)?.isMastermind ?? false;
  const next: DetectiveProfile = {
    ...profile,
    solvedCases,
    deolaneCaptured: profile.deolaneCaptured || mastermind,
    hallOfFame: profile.hallOfFame || (mastermind && solvedCases >= 14),
    recentCulpritIds: [culpritId, ...profile.recentCulpritIds].slice(0, 3),
    recentStartCityIds: [startCityId, ...profile.recentStartCityIds].slice(0, 3),
    recentStolenItemIds: [itemId, ...profile.recentStolenItemIds].slice(0, 3)
  };
  return { profile: next, promoted: before !== rankForSolvedCases(solvedCases).id };
};

