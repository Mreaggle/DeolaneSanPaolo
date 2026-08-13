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
    const flagTexts = new Set(content.cities.flatMap((city) => city.facts.filter((fact) => fact.id.endsWith('-fact-flag')).map((fact) => fact.text)));
    const geographicCategoryByText = new Map(content.cities.flatMap((city) => city.facts.map((fact) => [fact.text, fact.category] as const)));
    const generatedCategories = new Set<string>();
    let generatedFlagClues = 0;
    for (let index = 0; index < 200; index += 1) {
      const definition = generateCase(profile, `solvable-${index}`, content);
      expect(validateCase(definition, content)).toEqual([]);
      expect(definition.route).toHaveLength(4);
      expect(definition.culpritId).not.toBe('deolane-san-paolo');
      const identityClues = definition.route.slice(0, -1).flatMap((cityId) =>
        definition.cities[cityId]!.places.map((place) => place.clue).filter((clue) => clue.family === 'identity')
      );
      const uniqueIdentityClues = identityClues.filter((clue) =>
        content.suspects.filter((suspect) => suspect.traits[clue.targetTraitCategory!] === clue.targetTraitValue).length === 1
      );
      expect(identityClues.length).toBeGreaterThanOrEqual(2);
      expect(identityClues.length).toBeLessThanOrEqual(3);
      expect(uniqueIdentityClues.length).toBeLessThanOrEqual(1);
      if (uniqueIdentityClues.length) expect(identityClues.at(-1)).toBe(uniqueIdentityClues[0]);
      for (let routeIndex = 0; routeIndex < definition.route.length - 1; routeIndex += 1) {
        const city = definition.cities[definition.route[routeIndex]!]!;
        const target = definition.route[routeIndex + 1]!;
        const geographicClues = city.places.filter((place) => place.clue.family === 'geographic');
        generatedFlagClues += geographicClues.filter((place) => flagTexts.has(place.clue.text)).length;
        for (const place of geographicClues) {
          const generatedCategory = geographicCategoryByText.get(place.clue.text);
          if (generatedCategory) generatedCategories.add(generatedCategory);
        }
        expect(geographicClues.length).toBeGreaterThanOrEqual(2);
        expect(geographicClues.length).toBeLessThanOrEqual(3);
        expect(geographicClues.some((place) => (place.clue.compatibleCityIds?.length ?? 0) >= 2)).toBe(true);
        expect(geographicClues.every((place) => (place.clue.compatibleCityIds?.length ?? 0) < city.travelCandidates.length)).toBe(true);
        expect(city.places.filter((place) => place.clue.family === 'identity').every((place) => /^(Eu|Notei|Ouvi|Lembro|Pelo que)\b/.test(place.clue.text))).toBe(true);
        expect(city.places.every((place) => !/revel/i.test(place.clue.text))).toBe(true);
        expect(city.places.every((place) => !/fronteira internacional/i.test(place.clue.text))).toBe(true);
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
    expect(generatedFlagClues).toBeGreaterThan(0);
    expect(generatedCategories).toEqual(new Set(content.cities[0]!.facts.map((fact) => fact.category)));
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
