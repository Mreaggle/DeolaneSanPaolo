import { describe, expect, it } from 'vitest';
import { content } from '../../src/content';
import { createProfile } from '../../src/engine/CaseEngine';
import { generateCase } from '../../src/generation/CaseGenerator';
import { validateCase } from '../../src/generation/CaseValidator';

describe('validação estatística por patente', () => {
  it('valida 1.000 casos por faixa de dificuldade', () => {
    const solvedCounts = [0, 1, 4, 7, 10];
    for (const solvedCases of solvedCounts) {
      const profile = { ...createProfile('Carga'), solvedCases };
      for (let index = 0; index < 1_000; index += 1) {
        const definition = generateCase(profile, `bulk-${solvedCases}-${index}`, content);
        expect(validateCase(definition, content), definition.seed).toEqual([]);
      }
    }
  });
});
