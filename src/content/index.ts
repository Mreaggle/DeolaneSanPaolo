import { cities } from './data/cities';
import { connections } from './data/connections';
import { places } from './data/places';
import { ranks } from './data/ranks';
import { suspects } from './data/suspects';
import { stolenItems } from './data/items';

export const content = Object.freeze({
  contentVersion: 5,
  cities,
  connections,
  places,
  ranks,
  suspects,
  stolenItems,
  organizations: [
    { id: 'agencia-atlas', name: 'Agência Federal', type: 'detective-agency' as const },
    { id: 'tcc', name: 'T.C.C. — Tríade Chapa-Coco', type: 'criminal-organization' as const }
  ]
});

export type GameContent = typeof content;
export * from './types';
export * from './data/suspects';
export { cities } from './data/cities';
export { connections } from './data/connections';
export { places } from './data/places';
export { ranks } from './data/ranks';
export { stolenItems } from './data/items';
