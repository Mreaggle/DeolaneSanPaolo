export type RankId = 'rookie' | 'sleuth' | 'private-eye' | 'investigator' | 'ace-detective';
export type TraitCategory = 'sex' | 'hair' | 'hobby' | 'feature' | 'vehicle';

export interface ClueFact {
  id: string;
  text: string;
  compatibleCityIds: readonly string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: { x: number; y: number };
  allowedPlaceIds: readonly string[];
  artworkAssetId: string;
  brief: string;
  facts: readonly ClueFact[];
}

export interface Connection {
  fromCityId: string;
  toCityId: string;
  travelHours: number;
}

export interface Suspect {
  id: string;
  name: string;
  occupation: string;
  biography: string;
  isMastermind: boolean;
  traits: Record<TraitCategory, string>;
  dossierAssetId: string;
  encounterAssetId: string;
}

export interface Witness {
  id: string;
  name: string;
  assetId: string;
}

export interface Place {
  id: string;
  name: string;
  backgroundAssetId: string;
  witnesses: readonly Witness[];
}

export interface StolenItem {
  id: string;
  name: string;
  assetId: string;
  compatibleCityIds?: readonly string[];
  compatibleRegionIds?: readonly string[];
}

export interface RankDefinition {
  id: RankId;
  name: string;
  minSolved: number;
  routeLength: number;
  travelChoices: number;
}
