import type { Place } from '../types';

const rows = [
  ['airport', 'Aeroporto', [['pilot', 'Célio Aéreo'], ['ticket-clerk', 'Bia Lhete'], ['ground-controller', 'Dora Radar']]],
  ['bank', 'Banco', [['teller', 'Caio Xá'], ['guard', 'Cida Dão'], ['executive', 'Beto Rente']]],
  ['foreign-ministry', 'Ministério Exterior', [['clerk', 'Rita Visto'], ['attache', 'Adil Son'], ['ambassador', 'Ema Baixada']]],
  ['harbor', 'Porto', [['dockworker', 'Este Vador'], ['captain', 'Capi Tão'], ['customs-officer', 'Adu Ana']]],
  ['hotel', 'Hotel', [['manager', 'Hélio Tel'], ['bellhop', 'Nando Malas'], ['concierge', 'Conceição Erge']]],
  ['library', 'Biblioteca', [['librarian', 'Bia Blioteca'], ['archivist', 'Arqui Valdo'], ['researcher', 'Rui Busca']]],
  ['marketplace', 'Mercado', [['vendor', 'Vando Preço'], ['jeweler', 'Joia Nilda'], ['food-seller', 'Cida Feira']]],
  ['museum', 'Museu', [['curator', 'Musa Ema'], ['guard', 'Gilda Guarda'], ['restorer', 'Rê Stauro']]],
  ['palace', 'Palácio', [['chamberlain', 'Cami Leiro'], ['guard', 'Guaracy Portão'], ['gardener', 'Jardel Flores']]],
  ['riverfront', 'Margem do Rio', [['fisher', 'Pedro Escador'], ['boatman', 'Beto Canoa'], ['tour-guide', 'Guia Naldo']]],
  ['sports-club', 'Clube Esportivo', [['coach', 'Tânia Dores'], ['player', 'Atle Tadeu'], ['attendant', 'Célia Quadra']]],
  ['stock-exchange', 'Bolsa de Valores', [['broker', 'Correa Tor'], ['runner', 'Mário Mercado'], ['analyst', 'Ana Lista']]]
] as const;

export const places: readonly Place[] = rows.map(([id, name, witnessNames]) => ({
  id, name, backgroundAssetId: `place-${id}`,
  witnesses: witnessNames.map(([role, witnessName]) => {
    return { id: `${id}-${role}`, name: witnessName, assetId: `witness-${id}-${role}` };
  })
}));
