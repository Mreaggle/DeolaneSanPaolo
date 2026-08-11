import type { Connection } from '../types';
import { cityIds } from './cities';

const seen = new Set<string>();
const result: Connection[] = [];

for (let index = 0; index < cityIds.length; index += 1) {
  for (const offset of [1, 5, 11]) {
    const fromCityId = cityIds[index]!;
    const toCityId = cityIds[(index + offset) % cityIds.length]!;
    const key = [fromCityId, toCityId].sort().join('--');
    if (seen.has(key)) continue;
    seen.add(key);
    const travelHours = 3 + ((index + offset) % 5);
    result.push({ fromCityId, toCityId, travelHours }, { fromCityId: toCityId, toCityId: fromCityId, travelHours });
  }
}

export const connections: readonly Connection[] = result;

