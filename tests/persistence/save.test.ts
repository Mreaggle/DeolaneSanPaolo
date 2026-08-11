import { describe, expect, it } from 'vitest';
import { createProfile, initialState } from '../../src/engine/CaseEngine';
import { SaveRepository, type StorageAdapter } from '../../src/persistence/SaveRepository';

class MemoryStorage implements StorageAdapter {
  value: string | null = null;
  get(): string | null { return this.value; }
  set(_key: string, value: string): void { this.value = value; }
  remove(): void { this.value = null; }
}

describe('SaveRepository', () => {
  it('salva, restaura e limpa o schema versionado', () => {
    const storage = new MemoryStorage();
    const repository = new SaveRepository(storage);
    const state = initialState(createProfile('Nina'));
    repository.save(state);
    expect(repository.load()).toEqual(state);
    repository.clear();
    expect(repository.load()).toBeUndefined();
  });

  it('ignora conteúdo inválido ou schema desconhecido', () => {
    const storage = new MemoryStorage();
    const repository = new SaveRepository(storage);
    storage.value = '{quebrado';
    expect(repository.load()).toBeUndefined();
    storage.value = JSON.stringify({ schemaVersion: 99 });
    expect(repository.load()).toBeUndefined();
  });
});
