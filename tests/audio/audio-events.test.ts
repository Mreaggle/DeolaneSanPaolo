import { describe, expect, it } from 'vitest';
import { arrivalAudioEvent, audioEventMap } from '../../src/audio/audioEvents';
import { audioRegistry } from '../../src/audio/audioRegistry';

describe('mapeamento semântico da trilha', () => {
  it('correlaciona exatamente um evento de jogo a cada um dos 25 cues', () => {
    expect(audioEventMap).toEqual({
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
      HALL_OF_FAME_ENTERED: 'HALL_OF_FAME'
    });
    expect(new Set(Object.values(audioEventMap))).toEqual(new Set(Object.keys(audioRegistry)));
  });

  it('resolve a chegada pelo evento mais específico', () => {
    expect(arrivalAudioEvent('CORRECT_FORWARD', false, false)).toBe('ARRIVED_CORRECT_CITY');
    expect(arrivalAudioEvent('CORRECT_FORWARD', true, false)).toBe('HENCHMAN_APPEARED');
    expect(arrivalAudioEvent('WRONG_CITY', false, false)).toBe('COLD_TRAIL_CONFIRMED');
    expect(arrivalAudioEvent('OLD_ROUTE_CITY', false, false)).toBe('COLD_TRAIL_CONFIRMED');
    expect(arrivalAudioEvent('TRAIL_ANCHOR', false, false)).toBeUndefined();
    expect(arrivalAudioEvent('FINAL_CITY', false, false)).toBe('FINAL_CITY_REACHED');
    expect(arrivalAudioEvent('FINAL_CITY', false, true)).toBeUndefined();
  });
});

