import { describe, expect, it } from 'vitest';
import { content } from '../../src/content';
import { createProfile } from '../../src/engine/CaseEngine';
import { generateCase } from '../../src/generation/CaseGenerator';
import { validateCase } from '../../src/generation/CaseValidator';

describe('CaseGenerator', () => {
  it('reproduz o mesmo caso a partir da mesma seed', () => {
    const profile = createProfile('Bia');
    expect(generateCase(profile, 'atlas-42', content)).toEqual(generateCase(profile, 'atlas-42', content));
  });

  it('gera rotas, opções e provas sempre solucionáveis', () => {
    const profile = createProfile('Bia');
    for (let index = 0; index < 100; index += 1) {
      const definition = generateCase(profile, `solvable-${index}`, content);
      expect(validateCase(definition, content)).toEqual([]);
      expect(definition.route).toHaveLength(4);
      expect(definition.culpritId).not.toBe('deolane-san-paolo');
      const start = content.cities.find((city) => city.id === definition.route[0])!;
      const item = content.stolenItems.find((candidate) => candidate.id === definition.stolenItemId)!;
      expect(item.compatibleCityIds?.includes(start.id) || item.compatibleRegionIds?.includes(start.region)).toBe(true);
    }
  });

  it('reserva Deolane para o décimo quarto e último caso', () => {
    const profile = { ...createProfile('Bia'), solvedCases: 13 };
    const definition = generateCase(profile, 'final-tcc', content);
    expect(definition.caseType).toBe('FINAL_DEOLANE');
    expect(definition.culpritId).toBe('deolane-san-paolo');
    expect(definition.route).toHaveLength(8);
  });
});
