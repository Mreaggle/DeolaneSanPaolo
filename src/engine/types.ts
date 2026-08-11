import type { RankId, TraitCategory } from '../content';

export type CaseStatus = 'ACTIVE' | 'SOLVED' | 'FAILED_TIME' | 'FAILED_NO_WARRANT' | 'FAILED_WRONG_WARRANT' | 'ABANDONED';
export type ArrivalClassification = 'CORRECT_FORWARD' | 'WRONG_CITY' | 'OLD_ROUTE_CITY' | 'TRAIL_ANCHOR' | 'FINAL_CITY';

export interface DetectiveProfile {
  id: string;
  name: string;
  solvedCases: number;
  failedCases: number;
  deolaneCaptured: boolean;
  hallOfFame: boolean;
  recentCulpritIds: string[];
  recentStartCityIds: string[];
  recentStolenItemIds: string[];
}

export interface GeneratedClue {
  id: string;
  family: 'geographic' | 'identity' | 'negative' | 'old-trail' | 'final-proximity';
  text: string;
  targetCityId?: string;
  targetTraitCategory?: TraitCategory;
  targetTraitValue?: string;
}

export interface GeneratedPlaceDefinition {
  placeId: string;
  witnessId: string;
  clue: GeneratedClue;
}

export interface GeneratedCityDefinition {
  cityId: string;
  places: readonly GeneratedPlaceDefinition[];
  travelCandidates: readonly string[];
}

export interface CaseDefinition {
  id: string;
  seed: string;
  generationVersion: number;
  contentVersion: number;
  caseType: 'STANDARD' | 'FINAL_DEOLANE';
  rankId: RankId;
  culpritId: string;
  stolenItemId: string;
  route: readonly string[];
  cities: Readonly<Record<string, GeneratedCityDefinition>>;
  finalCityId: string;
  finalHideoutPlaceId: string;
  deadlineHour: 120;
}

export interface WrongCityDefinition extends GeneratedCityDefinition {
  anchorCityId: string;
}

export interface CaseRuntimeState {
  status: CaseStatus;
  currentCityId: string;
  furthestRouteIndex: number;
  trailAnchorCityId: string;
  elapsedHours: number;
  investigationsThisVisit: number;
  visitedLocationKeys: string[];
  discoveredClueIds: string[];
  activeWarrantSuspectId?: string;
  wrongCities: Record<string, WrongCityDefinition>;
}

export interface ActiveCase {
  definition: CaseDefinition;
  runtime: CaseRuntimeState;
}

export interface GameState {
  schemaVersion: 1;
  profile: DetectiveProfile;
  activeCase?: ActiveCase;
}

export interface WarrantInput {
  sex?: string;
  hair?: string;
  hobby?: string;
  feature?: string;
  vehicle?: string;
}

export type GameEvent =
  | { type: 'CASE_STARTED' }
  | { type: 'INVESTIGATION_COMPLETED'; clue: GeneratedClue; reviewed: boolean; finalEncounter: boolean }
  | { type: 'ARRIVED'; classification: ArrivalClassification; cityId: string }
  | { type: 'WARRANT_NO_MATCH' }
  | { type: 'WARRANT_MULTIPLE_MATCHES'; suspectIds: readonly string[] }
  | { type: 'WARRANT_ISSUED'; suspectId: string }
  | { type: 'CASE_SOLVED'; promoted: boolean }
  | { type: 'CASE_FAILED'; status: Exclude<CaseStatus, 'ACTIVE' | 'SOLVED'> };

export interface EngineResult {
  state: Readonly<GameState>;
  event: GameEvent;
}

