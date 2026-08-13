import type { Place } from '../types';

const rows = [
  ['airport', 'Aeroporto', [['pilot', 'Piloto/a'], ['ticket-clerk', 'Atendente de Passagens'], ['ground-controller', 'Controlador/a de Solo']]],
  ['bank', 'Banco', [['teller', 'Caixa'], ['guard', 'Segurança'], ['executive', 'Gerente do Banco']]],
  ['foreign-ministry', 'Ministério Exterior', [['clerk', 'Funcionário/a Consular'], ['attache', 'Adido/a Diplomático/a'], ['ambassador', 'Embaixador/a']]],
  ['harbor', 'Porto', [['dockworker', 'Estivador/a'], ['captain', 'Capitão/Capitã'], ['customs-officer', 'Fiscal da Alfândega']]],
  ['hotel', 'Hotel', [['manager', 'Gerente do Hotel'], ['bellhop', 'Mensageiro/a'], ['concierge', 'Concierge']]],
  ['library', 'Biblioteca', [['librarian', 'Bibliotecário/a'], ['archivist', 'Arquivista'], ['researcher', 'Pesquisador/a']]],
  ['marketplace', 'Mercado', [['vendor', 'Vendedor/a'], ['jeweler', 'Joalheiro/a'], ['food-seller', 'Feirante']]],
  ['museum', 'Museu', [['curator', 'Curador/a'], ['guard', 'Segurança do Museu'], ['restorer', 'Restaurador/a']]],
  ['palace', 'Palácio', [['chamberlain', 'Camareiro/a'], ['guard', 'Guarda do Palácio'], ['gardener', 'Jardineiro/a']]],
  ['riverfront', 'Margem do Rio', [['fisher', 'Pescador/a'], ['boatman', 'Barqueiro/a'], ['tour-guide', 'Guia Turístico/a']]],
  ['sports-club', 'Clube Esportivo', [['coach', 'Técnico/a'], ['player', 'Atleta'], ['attendant', 'Atendente do Clube']]],
  ['stock-exchange', 'Bolsa de Valores', [['broker', 'Corretor/a'], ['runner', 'Operador/a do Pregão'], ['analyst', 'Analista de Mercado']]]
] as const;

export const places: readonly Place[] = rows.map(([id, name, witnessRoles], iconAtlasIndex) => ({
  id, name, backgroundAssetId: `place-${id}`, iconAssetId: 'place-icon-atlas', iconAtlasIndex,
  witnesses: witnessRoles.map(([role, title]) => {
    return { id: `${id}-${role}`, title, assetId: `witness-${id}-${role}` };
  })
}));
