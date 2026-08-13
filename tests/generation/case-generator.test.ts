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
      for (let routeIndex = 0; routeIndex < definition.route.length - 1; routeIndex += 1) {
        const city = definition.cities[definition.route[routeIndex]!]!;
        const target = definition.route[routeIndex + 1]!;
        const geographicClues = city.places.filter((place) => place.clue.family === 'geographic');
        expect(geographicClues).toHaveLength(2);
        expect(geographicClues.some((place) => (place.clue.compatibleCityIds?.length ?? 0) >= 2)).toBe(true);
        expect(city.places.some((place) => place.clue.family === 'identity')).toBe(true);
        expect(city.places.filter((place) => place.clue.family === 'identity').every((place) => place.clue.text.startsWith('A testemunha '))).toBe(true);
        expect(city.places.every((place) => !/revel/i.test(place.clue.text))).toBe(true);
        expect(city.places.some((place) => place.clue.text.includes(' ficou entre '))).toBe(false);
        const combined = city.travelCandidates.filter((candidate) =>
          geographicClues.every((place) => place.clue.compatibleCityIds?.includes(candidate))
        );
        expect(combined).toEqual([target]);
      }
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

  it('não libera Deolane antes da meta final e a força depois da meta persistida', () => {
    for (const solvedCases of [0, 1, 12]) {
      const profile = { ...createProfile('Bia'), solvedCases };
      for (let index = 0; index < 30; index += 1) {
        expect(generateCase(profile, `ordinary-${solvedCases}-${index}`, content).culpritId).not.toBe('deolane-san-paolo');
      }
    }
    const eligible = { ...createProfile('Bia'), solvedCases: 13, deolaneCaptured: false };
    expect(generateCase(eligible, 'final-forcada', content).culpritId).toBe('deolane-san-paolo');
  });
});
