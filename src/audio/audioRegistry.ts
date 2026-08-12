export const audioRegistry = {
  TITLE_THEME: '1_title_theme.mp3',
  HEADQUARTERS_AGENCY: '2_headquarters_agency.mp3',
  DETECTIVE_SEARCH: '3_detective_search.mp3',
  DETECTIVE_UNKNOWN: '4_detective_unknown.mp3',
  NEWS_FLASH: '5_news_flash.mp3',
  CASE_ASSIGNMENT: '6_case_assignment.mp3',
  AIRPLANE_TRAVEL: '7_airplane_travel.mp3',
  HOT_TRAIL: '8_hot_trail.mp3',
  COLD_TRAIL: '9_cold_trail.mp3',
  SUSPICIOUS_HENCHMAN: '10_suspicious_henchman.mp3',
  CULPRIT_VERY_CLOSE: '11_culprit_very_close.mp3',
  TIME_ALMOST_EXPIRED: '12_time_almost_expired.mp3',
  CRIME_COMPUTER_CALCULATING: '13_crime_computer_calculating.mp3',
  WARRANT_ISSUED: '14_warrant_issued.mp3',
  WARRANT_INCONCLUSIVE: '15_warrant_inconclusive.mp3',
  FINAL_CITY: '16_final_city.mp3',
  WRONG_FINAL_HIDEOUT: '17_wrong_final_hideout.mp3',
  CRIMINAL_REVEALED: '18_criminal_revealed.mp3',
  CRIMINAL_ESCAPED: '19_criminal_escaped.mp3',
  CASE_CLOSED: '20_case_closed.mp3',
  RANK_PROMOTION: '21_rank_promotion.mp3',
  DEOLANE_LEITMOTIF: '22_deolane_san_paolo_leitmotif.mp3',
  FINAL_DEOLANE_REVEAL: '23_final_deolane_reveal.mp3',
  FINAL_CAPTURE_DEOLANE: '24_final_capture_of_Deolane.mp3',
  HALL_OF_FAME: '25_hall_of_fame.mp3',
  DOSSIERS: '27_dossiers.mp3'
} as const;

export type AudioCueId = keyof typeof audioRegistry;

export const ambientTrack = '26_ambient_background.mp3';
export const audioUrl = (filename: string): string => `${import.meta.env.BASE_URL}audio/music/${filename}`;

export const uiSoundRegistry = {
  TYPEWRITER: 'typewriter.mp3',
  MOUSE_CLICK: 'mouse_click.mp3'
} as const;

export type UiSoundId = keyof typeof uiSoundRegistry;
export const uiSoundUrl = (filename: string): string => `${import.meta.env.BASE_URL}audio/sfx/${filename}`;

export const hardCutCues = new Set<AudioCueId>([
  'DETECTIVE_UNKNOWN', 'COLD_TRAIL', 'TIME_ALMOST_EXPIRED',
  'WARRANT_INCONCLUSIVE', 'WRONG_FINAL_HIDEOUT'
]);

export const preloadGroups = {
  opening: ['TITLE_THEME', 'HEADQUARTERS_AGENCY', 'DETECTIVE_SEARCH', 'DETECTIVE_UNKNOWN', 'NEWS_FLASH', 'CASE_ASSIGNMENT'],
  case: ['AIRPLANE_TRAVEL', 'HOT_TRAIL', 'COLD_TRAIL', 'SUSPICIOUS_HENCHMAN', 'CULPRIT_VERY_CLOSE', 'TIME_ALMOST_EXPIRED', 'CRIME_COMPUTER_CALCULATING', 'WARRANT_ISSUED', 'WARRANT_INCONCLUSIVE', 'FINAL_CITY', 'WRONG_FINAL_HIDEOUT', 'CRIMINAL_REVEALED', 'CRIMINAL_ESCAPED', 'CASE_CLOSED', 'RANK_PROMOTION', 'DOSSIERS'],
  finale: ['DEOLANE_LEITMOTIF', 'FINAL_DEOLANE_REVEAL', 'FINAL_CAPTURE_DEOLANE', 'HALL_OF_FAME']
} as const satisfies Record<string, readonly AudioCueId[]>;
