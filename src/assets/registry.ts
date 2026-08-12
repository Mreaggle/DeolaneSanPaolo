import { cities, places, stolenItems, suspects } from '../content';

const staticAssets: Record<string, string> = {
  'title-logo': 'assets/title/title-logo.png',
  'title-wordmark': 'assets/title/deolane-logo.png',
  'title-wordmark-retro': 'assets/title/deolane-retro.png',
  'title-background': 'assets/title/title-background.png',
  'hq-background': 'assets/narrative/hq-background.png',
  'news-flash-background': 'assets/narrative/news-flash-background.png',
  'assignment-background': 'assets/narrative/assignment-background.png',
  'case-solved-background': 'assets/narrative/case-solved-background.png',
  'case-failed-time-background': 'assets/narrative/case-failed-time-background.png',
  'case-failed-no-warrant-background': 'assets/narrative/case-failed-no-warrant-background.png',
  'case-failed-wrong-warrant-background': 'assets/narrative/case-failed-wrong-warrant-background.png',
  'case-failed-abandoned-background': 'assets/narrative/case-failed-abandoned-background.png',
  'promotion-background': 'assets/narrative/promotion-background.png',
  'hall-of-fame-background': 'assets/narrative/hall-of-fame-background.png',
  'agency-clerk-portrait': 'assets/narrative/agency-clerk-portrait.png',
  'world-map': 'assets/maps/world-map.png',
  'dossier-cabinet-illustration': 'assets/narrative/dossier-cabinet-illustration.png',
  'warrant-computer-panel': 'assets/narrative/warrant-computer-panel.png',
  'agency-emblem': 'assets/emblems/agency-emblem.png',
  'tcc-emblem': 'assets/emblems/tcc-emblem.png',
  'rank-rookie-badge': 'assets/ranks/rank-rookie-badge.png',
  'rank-sleuth-badge': 'assets/ranks/rank-sleuth-badge.png',
  'rank-private-eye-badge': 'assets/ranks/rank-private-eye-badge.png',
  'rank-investigator-badge': 'assets/ranks/rank-investigator-badge.png',
  'rank-ace-detective-badge': 'assets/ranks/rank-ace-detective-badge.png',
  'icon-see': 'assets/icons/icon-see.png',
  'icon-depart': 'assets/icons/icon-depart.png',
  'icon-search': 'assets/icons/icon-search.png',
  'icon-files': 'assets/icons/icon-files.png',
  'icon-pc': 'assets/icons/icon-pc.png',
  'icon-back': 'assets/icons/icon-back.png',
  'icon-continue': 'assets/icons/icon-continue.png',
  'icon-clock': 'assets/icons/icon-clock.png',
  'icon-warrant': 'assets/icons/icon-warrant.png',
  'icon-map-marker-current': 'assets/icons/icon-map-marker-current.png',
  'icon-map-marker-available': 'assets/icons/icon-map-marker-available.png',
  'icon-warning': 'assets/icons/icon-warning.png',
  'icon-sound-on': 'assets/icons/icon-sound-on.png',
  'icon-sound-off': 'assets/icons/icon-sound-off.png',
  'travel-airplane-spritesheet': 'assets/animations/travel-airplane-spritesheet.png',
  'trail-alert-spritesheet': 'assets/animations/trail-alert-spritesheet.png',
  'capture-spritesheet': 'assets/animations/capture-spritesheet.png',
  'escape-spritesheet': 'assets/animations/escape-spritesheet.png',
  'henchman-run-spritesheet': 'assets/animations/henchman-run-spritesheet.png'
};

for (const city of cities) staticAssets[city.artworkAssetId] = `assets/cities/${city.id}.png`;
for (const place of places) {
  staticAssets[place.backgroundAssetId] = `assets/places/${place.id}.png`;
  for (const witness of place.witnesses) staticAssets[witness.assetId] = `assets/witnesses/${witness.assetId.replace('witness-', '')}.png`;
}
for (const suspect of suspects) {
  staticAssets[suspect.dossierAssetId] = `assets/suspects/dossiers/${suspect.id}-dossier.png`;
  staticAssets[suspect.encounterAssetId] = `assets/suspects/encounters/${suspect.id}-encounter.png`;
}
for (const item of stolenItems) staticAssets[item.assetId] = `assets/items/${item.id}.png`;

export const assetRegistry = Object.freeze(staticAssets);

export const resolveAsset = (id: string): string => `${import.meta.env.BASE_URL}${assetRegistry[id] ?? staticAssets['agency-emblem']!}`;
