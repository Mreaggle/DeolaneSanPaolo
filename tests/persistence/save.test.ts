import { describe, expect, it } from 'vitest';
import { createProfile, initialState } from '../../src/engine/CaseEngine';
import { GameEngine } from '../../src/engine/GameEngine';
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

  it('migra o relógio de casos ativos preservando o instante e o progresso', () => {
    const storage = new MemoryStorage();
    const repository = new SaveRepository(storage);
    const engine = new GameEngine(initialState(createProfile('Nina')));
    engine.startCase('save-antigo');
    const legacy = structuredClone(engine.state);
    const activeCase = legacy.activeCase!;
    activeCase.runtime.elapsedHours = 8;
    delete (activeCase.runtime as Partial<typeof activeCase.runtime>).clockVersion;
    activeCase.definition.deadlineHour = 120;
    storage.value = JSON.stringify(legacy);

    expect(repository.load()?.activeCase).toMatchObject({
      definition: { deadlineHour: 154 },
      runtime: { elapsedHours: 10, clockVersion: 2 }
    });
  });

  it('preserva a carreira e descarta somente caso ativo com matriz de traits anterior', () => {
    const storage = new MemoryStorage();
    const repository = new SaveRepository(storage);
    const engine = new GameEngine(initialState({ ...createProfile('Nina'), solvedCases: 6 }));
    engine.startCase('traits-antigos');
    const legacy = structuredClone(engine.state);
    legacy.activeCase!.definition.contentVersion = 2;
    storage.value = JSON.stringify(legacy);

    expect(repository.load()).toMatchObject({ profile: { name: 'Nina', solvedCases: 6 } });
    expect(repository.load()?.activeCase).toBeUndefined();
  });
});
