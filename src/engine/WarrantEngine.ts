import type { Suspect, TraitCategory } from '../content';
import type { WarrantInput } from './types';

const categories: readonly TraitCategory[] = ['sex', 'hair', 'hobby', 'feature', 'vehicle'];

export const matchSuspects = (suspects: readonly Suspect[], input: WarrantInput): readonly string[] => suspects
  .filter((suspect) => categories.every((category) => input[category] === undefined || input[category] === suspect.traits[category]))
  .map((suspect) => suspect.id);

