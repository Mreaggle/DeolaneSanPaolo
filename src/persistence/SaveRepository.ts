import type { GameState } from '../engine/types';

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
      return parsed.schemaVersion === 1 ? parsed : undefined;
    } catch {
      return undefined;
    }
  }

  save(state: Readonly<GameState>): void {
    this.storage.set(KEY, JSON.stringify(state));
  }

  clear(): void { this.storage.remove(KEY); }
}

