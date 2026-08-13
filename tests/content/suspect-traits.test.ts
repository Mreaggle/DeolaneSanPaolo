import { describe, expect, it } from 'vitest';
import { content, traitClueTexts, type TraitCategory } from '../../src/content';
import { matchSuspects } from '../../src/engine/WarrantEngine';

const categories: readonly TraitCategory[] = ['sex', 'hair', 'hobby', 'feature', 'vehicle'];

const combinations = <T>(values: readonly T[], count: number): T[][] => {
  if (count === 0) return [[]];
  return values.flatMap((value, index) => combinations(values.slice(index + 1), count - 1).map((tail) => [value, ...tail]));
};

describe('matriz de traits dos suspeitos', () => {
  it('nenhum trait isolado identifica uma única pessoa', () => {
    for (const category of categories) {
      for (const value of new Set(content.suspects.map((suspect) => suspect.traits[category]))) {
        expect(matchSuspects(content.suspects, { [category]: value }), `${category}=${value}`).not.toHaveLength(1);
      }
    }
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
      expect(traitClueTexts[value], value).toMatch(/^A testemunha /);
      expect(traitClueTexts[value], value).not.toMatch(/revel/i);
    }
    for (const hair of new Set(content.suspects.map((suspect) => suspect.traits.hair))) {
      expect(traitClueTexts[hair], hair).toContain('possuía cabelo');
    }
  });
});
