import type { GameState } from '../engine/types';
import { content } from '../content';
import { FIRST_ACTION_ELAPSED_HOURS } from '../engine/TimeEngine';

const KEY = 'deolane-san-paolo.save';

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export class BrowserStorageAdapter implements StorageAdapter {
  get(key: string): string | null { return localStorage.getItem(key); }
  set(key: string, value: string): void { localStorage.setItem(key, value); }
  remove(key: string): void { localStorage.removeItem(key); }
}

export class SaveRepository {
  constructor(private readonly storage: StorageAdapter) {}

  load(): GameState | undefined {
    const raw = this.storage.get(KEY);
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw) as GameState;
      if (parsed.schemaVersion !== 1) return undefined;
      if (parsed.activeCase && parsed.activeCase.definition.contentVersion < content.contentVersion) {
        delete parsed.activeCase;
      }
      if (parsed.activeCase && !parsed.activeCase.runtime.audioFlags) {
        parsed.activeCase.runtime.audioFlags = { timeWarningPlayed: false, finalCityPlayed: false };
      }
      if (parsed.activeCase && !parsed.activeCase.runtime.clockVersion) {
        parsed.activeCase.runtime.elapsedHours += FIRST_ACTION_ELAPSED_HOURS;
        parsed.activeCase.runtime.clockVersion = 2;
        parsed.activeCase.definition.deadlineHour = 154;
      }
      return parsed;
    } catch {
      return undefined;
    }
  }

  save(state: Readonly<GameState>): void {
    this.storage.set(KEY, JSON.stringify(state));
  }

  clear(): void { this.storage.remove(KEY); }
}
