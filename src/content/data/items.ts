import type { StolenItem } from '../types';

const items = [
  ['golden-astrolabe', 'Astrolábio Dourado', ['middle-east', 'europe']],
  ['imperial-dagger', 'Adaga Imperial', ['asia', 'europe']],
  ['ceremonial-gold-mask', 'Máscara Cerimonial de Ouro', ['south-america', 'africa']],
  ['emerald-scepter', 'Cetro de Esmeraldas', ['asia', 'europe']],
  ['royal-seal', 'Selo Real', ['europe']],
  ['sun-disc', 'Disco Solar', ['africa', 'south-america']],
  ['ivory-manuscript-box', 'Caixa de Manuscritos de Marfim', ['africa', 'asia']],
  ['jeweled-crown', 'Coroa Cravejada', ['europe']],
  ['obsidian-idol', 'Ídolo de Obsidiana', ['north-america', 'south-america']],
  ['silver-compass', 'Bússola de Prata', ['europe', 'oceania']],
  ['sapphire-chalice', 'Cálice de Safira', ['europe', 'middle-east']],
  ['bronze-tablet', 'Tábua de Bronze', ['middle-east', 'africa', 'europe']],
  ['crystal-lotus', 'Lótus de Cristal', ['asia']],
  ['pearl-diadem', 'Diadema de Pérolas', ['asia', 'europe']],
  ['ancient-map-case', 'Estojo de Mapa Antigo', ['europe', 'north-america', 'oceania']],
  ['jade-amulet', 'Amuleto de Jade', ['asia']],
  ['marble-bust', 'Busto de Mármore', ['europe']],
  ['gilded-music-box', 'Caixa de Música Dourada', ['europe', 'asia']],
  ['ruby-orb', 'Orbe de Rubi', ['asia', 'europe']],
  ['scholar-scroll', 'Pergaminho do Sábio', ['asia', 'middle-east']]
] as const;

export const stolenItems: readonly StolenItem[] = items.map(([id, name, compatibleRegionIds]) => ({ id, name, assetId: `item-${id}`, compatibleRegionIds }));
