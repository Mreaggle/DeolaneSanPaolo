import { describe, expect, it } from 'vitest';
import { content } from '../../src/content';

describe('perfis das cidades', () => {
  it('mantém o texto cultural separado das pistas investigativas', () => {
    for (const city of content.cities) {
      expect(city.brief.length, city.name).toBeGreaterThan(80);
      expect(city.brief, city.name).not.toMatch(/\b(pediam|perguntaram|procuravam|queriam|trocaram|levavam|pagariam|usariam|falavam|comentaram|descreveram|seguiam)\b/i);
      for (const fact of city.facts) {
        expect(city.brief.toLocaleLowerCase('pt-BR'), city.name).not.toContain(fact.text.toLocaleLowerCase('pt-BR'));
      }
    }
  });
});
