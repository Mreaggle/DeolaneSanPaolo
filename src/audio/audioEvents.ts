import type { ArrivalClassification } from '../engine/types';
import type { AudioCueId } from './audioRegistry';

export const audioEventMap = {
  TITLE_ENTERED: 'TITLE_THEME',
  HEADQUARTERS_ENTERED: 'HEADQUARTERS_AGENCY',
  DETECTIVE_LOOKUP_STARTED: 'DETECTIVE_SEARCH',
  DETECTIVE_NOT_FOUND: 'DETECTIVE_UNKNOWN',
  NEWS_FLASH_STARTED: 'NEWS_FLASH',
  CASE_ASSIGNMENT_SHOWN: 'CASE_ASSIGNMENT',
  TRAVEL_STARTED: 'AIRPLANE_TRAVEL',
  ARRIVED_CORRECT_CITY: 'HOT_TRAIL',
  COLD_TRAIL_CONFIRMED: 'COLD_TRAIL',
  HENCHMAN_APPEARED: 'SUSPICIOUS_HENCHMAN',
  CULPRIT_PROXIMITY_HIGH: 'CULPRIT_VERY_CLOSE',
  TIME_WARNING_TRIGGERED: 'TIME_ALMOST_EXPIRED',
  WARRANT_COMPUTER_OPENED: 'CRIME_COMPUTER_CALCULATING',
  WARRANT_ISSUED: 'WARRANT_ISSUED',
  WARRANT_INCONCLUSIVE: 'WARRANT_INCONCLUSIVE',
  FINAL_CITY_REACHED: 'FINAL_CITY',
  FINAL_HIDEOUT_MISSED: 'WRONG_FINAL_HIDEOUT',
  CULPRIT_FOUND: 'CRIMINAL_REVEALED',
  CULPRIT_ESCAPED: 'CRIMINAL_ESCAPED',
  CASE_SOLVED: 'CASE_CLOSED',
  RANK_PROMOTED: 'RANK_PROMOTION',
  DEOLANE_THEME_REQUESTED: 'DEOLANE_LEITMOTIF',
  FINAL_DEOLANE_FOUND: 'FINAL_DEOLANE_REVEAL',
  DEOLANE_CAPTURED: 'FINAL_CAPTURE_DEOLANE',
  HALL_OF_FAME_ENTERED: 'HALL_OF_FAME',
  DOSSIERS_OPENED: 'DOSSIERS'
} as const satisfies Record<string, AudioCueId>;

export type AudioEventId = keyof typeof audioEventMap;

export const cueForAudioEvent = (event: AudioEventId): AudioCueId => audioEventMap[event];

export const arrivalAudioEvent = (
  classification: ArrivalClassification,
  henchmanAppeared: boolean,
  finalCityCuePlayed: boolean
): AudioEventId | undefined => {
  if (classification === 'FINAL_CITY') return finalCityCuePlayed ? undefined : 'FINAL_CITY_REACHED';
  if (henchmanAppeared) return 'HENCHMAN_APPEARED';
  if (classification === 'CORRECT_FORWARD') return 'ARRIVED_CORRECT_CITY';
  if (classification === 'WRONG_CITY' || classification === 'OLD_ROUTE_CITY') return 'COLD_TRAIL_CONFIRMED';
  return undefined;
};
