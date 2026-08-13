import { describe, expect, it } from 'vitest';
import { content, traitClueTexts, traitClueVariants, type TraitCategory } from '../../src/content';
import { matchSuspects } from '../../src/engine/WarrantEngine';

const categories: readonly TraitCategory[] = ['sex', 'hair', 'hobby', 'feature', 'vehicle'];

const combinations = <T>(values: readonly T[], count: number): T[][] => {
  if (count === 0) return [[]];
  return values.flatMap((value, index) => combinations(values.slice(index + 1), count - 1).map((tail) => [value, ...tail]));
};

describe('matriz de traits dos suspeitos', () => {
  it('mantém um vocabulário rico de opções no computador de mandados', () => {
    expect(new Set(content.suspects.map((suspect) => suspect.traits.hair)).size).toBeGreaterThanOrEqual(6);
    expect(new Set(content.suspects.map((suspect) => suspect.traits.hobby)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(content.suspects.map((suspect) => suspect.traits.feature)).size).toBeGreaterThanOrEqual(7);
    expect(new Set(content.suspects.map((suspect) => suspect.traits.vehicle)).size).toBeGreaterThanOrEqual(7);
  });

  it('cada suspeito é identificável por uma combinação válida de traits', () => {
    for (const suspect of content.suspects) {
      const identifyingCombination = [2, 3, 4, 5].flatMap((size) => combinations(categories, size)).find((selected) => {
        const input = Object.fromEntries(selected.map((category) => [category, suspect.traits[category]]));
        return matchSuspects(content.suspects, input).length === 1;
      });
      expect(identifyingCombination, suspect.id).toBeDefined();
    }
  });

  it('todo valor de trait possui relato testemunhal natural e não consentido', () => {
    const values = new Set(content.suspects.flatMap((suspect) => categories.map((category) => suspect.traits[category])));
    for (const value of values) {
      expect(traitClueTexts[value], value).toMatch(/^(Eu|Notei|Ouvi|Lembro)\b/);
      expect(traitClueTexts[value], value).not.toMatch(/revel/i);
      expect(traitClueTexts[value], value).not.toContain('A testemunha');
    }
    for (const hair of new Set(content.suspects.map((suspect) => suspect.traits.hair))) {
      expect(traitClueTexts[hair], hair).toMatch(/cabelo|calv/);
    }
  });

  it('mantém formulações variadas para todos os valores do computador', () => {
    const values = new Set(content.suspects.flatMap((suspect) => categories.map((category) => suspect.traits[category])));
    expect(values.size).toBeGreaterThanOrEqual(28);
    for (const value of values) {
      expect(traitClueVariants[value], value).toHaveLength(2);
      expect(new Set(traitClueVariants[value]).size, value).toBe(2);
      for (const text of traitClueVariants[value]!) {
        expect(text, value).toMatch(/^(Eu|Notei|Ouvi|Lembro|Pelo que)\b/);
        expect(text, value).not.toMatch(/revel|A testemunha/i);
      }
    }
  });
});
