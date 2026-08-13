import { describe, expect, it } from 'vitest';
import { content, type GeographicClueCategory } from '../../src/content';

const geographicCategories: readonly GeographicClueCategory[] = [
  'currency', 'landmark', 'culture', 'flag', 'language', 'history', 'geography',
  'fauna-flora', 'food', 'government', 'commodity', 'book-topic', 'artifact'
];

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

  it('oferece uma pista de bandeira verdadeira para cada destino', () => {
    const flagFacts = content.cities.map((city) => {
      const fact = city.facts.find((candidate) => candidate.id.endsWith('-fact-flag'));
      expect(fact, city.name).toBeDefined();
      expect(fact!.compatibleCityIds, city.name).toContain(city.id);
      expect(fact!.text, city.name).toMatch(/^Eu vi\b/);
      return fact!;
    });

    expect(new Set(flagFacts.map((fact) => fact.text)).size).toBeLessThan(content.cities.length);
    expect(content.cities.find((city) => city.id === 'buenos-aires')!.facts.find((fact) => fact.id.endsWith('-fact-flag'))!.text).toMatch(/sol no centro/i);
  });

  it('mantém em cada cidade toda a taxonomia geográfica do jogo clássico', () => {
    for (const city of content.cities) {
      expect(city.facts, city.name).toHaveLength(geographicCategories.length);
      expect(new Set(city.facts.map((fact) => fact.category)), city.name).toEqual(new Set(geographicCategories));
      expect(city.facts.every((fact) => fact.compatibleCityIds.includes(city.id)), city.name).toBe(true);
    }

    const sharedLanguages = content.cities.flatMap((city) => city.facts.filter((fact) => fact.category === 'language' && fact.compatibleCityIds.length > 1));
    const decisiveArtifacts = content.cities.flatMap((city) => city.facts.filter((fact) => fact.category === 'artifact' && fact.compatibleCityIds.length === 1));
    expect(sharedLanguages.length).toBeGreaterThan(0);
    expect(decisiveArtifacts.length).toBeGreaterThan(0);
  });
});
