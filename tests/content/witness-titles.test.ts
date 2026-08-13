import { describe, expect, it } from 'vitest';
import { places } from '../../src/content/data/places';

describe('cargos das testemunhas', () => {
  it('identifica todas as 36 testemunhas por cargo em vez de nome próprio', () => {
    const witnesses = places.flatMap((place) => place.witnesses);

    expect(witnesses).toHaveLength(36);
    expect(witnesses.map((witness) => witness.title)).toEqual([
      'Piloto/a', 'Atendente de Passagens', 'Controlador/a de Solo',
      'Caixa', 'Segurança', 'Gerente do Banco',
      'Funcionário/a Consular', 'Adido/a Diplomático/a', 'Embaixador/a',
      'Estivador/a', 'Capitão/Capitã', 'Fiscal da Alfândega',
      'Gerente do Hotel', 'Mensageiro/a', 'Concierge',
      'Bibliotecário/a', 'Arquivista', 'Pesquisador/a',
      'Vendedor/a', 'Joalheiro/a', 'Feirante',
      'Curador/a', 'Segurança do Museu', 'Restaurador/a',
      'Camareiro/a', 'Guarda do Palácio', 'Jardineiro/a',
      'Pescador/a', 'Barqueiro/a', 'Guia Turístico/a',
      'Técnico/a', 'Atleta', 'Atendente do Clube',
      'Corretor/a', 'Operador/a do Pregão', 'Analista de Mercado'
    ]);
  });
});
