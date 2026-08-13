import type { Suspect, TraitCategory } from '../types';

const suspect = (
  id: string,
  name: string,
  occupation: string,
  biography: string,
  traits: Record<TraitCategory, string>,
  isMastermind = false
): Suspect => ({
  id, name, occupation, biography, traits, isMastermind,
  dossierAssetId: `suspect-${id}-dossier`,
  encounterAssetId: `suspect-${id}-encounter`
});

export const suspects: readonly Suspect[] = [
  suspect('deolane-san-paolo', 'Deolane San Paolo', 'Chefe da Tríade Chapa-Coco', 'Ostentação, maquiagem pesada e joias monumentais tornam sua presença impossível de ignorar.', { sex: 'feminino', hair: 'loiro', hobby: 'colecionismo', feature: 'joias-exageradas', vehicle: 'carro-de-luxo' }, true),
  suspect('cris-minosa', 'Cris Minosa', 'Operadora sênior', 'Observa muito, fala pouco e deixa um perfume raro por onde passa.', { sex: 'feminino', hair: 'preto', hobby: 'colecionismo', feature: 'olhar-intenso', vehicle: 'moto' }),
  suspect('lua-metrayu', 'Lua Metrayu', 'Negociante de arte', 'Especialista em logística discreta e jogos de estratégia.', { sex: 'feminino', hair: 'preto', hobby: 'colecionismo', feature: 'olhar-intenso', vehicle: 'carro-de-luxo' }),
  suspect('thais-kizita', 'Thais Kizita', 'Infiltradora social', 'Entra em eventos exclusivos sorrindo e sai antes da conta chegar.', { sex: 'feminino', hair: 'loiro', hobby: 'vida-noturna', feature: 'rosto-marcante', vehicle: 'moto' }),
  suspect('tigrinia-fonseca', 'Tigrínia Fonseca', 'Frequentadora de cassinos', 'Transforma salões elegantes em mesas de aposta de alto risco.', { sex: 'feminino', hair: 'loiro', hobby: 'vida-noturna', feature: 'joias-exageradas', vehicle: 'carro-de-luxo' }),
  suspect('narcola-tamacho', 'Narcola Tamacho', 'Contrabandista', 'Um veterano das rotas de carga, reconhecível pelo nariz enorme.', { sex: 'masculino', hair: 'raspado', hobby: 'colecionismo', feature: 'rosto-marcante', vehicle: 'veiculo-customizado' }),
  suspect('paulo-escolar', 'Paulo Escolar', 'Fora-da-lei teatral', 'Conta histórias altas, toca violão e cultiva um bigode ainda maior.', { sex: 'masculino', hair: 'preto', hobby: 'musica', feature: 'rosto-marcante', vehicle: 'veiculo-customizado' }),
  suspect('zeze-do-rap', 'Zezé do Rap', 'Operador urbano', 'Chega fazendo barulho, rimando álibis e exibindo seu cupê.', { sex: 'masculino', hair: 'preto', hobby: 'musica', feature: 'olhar-intenso', vehicle: 'veiculo-customizado' }),
  suspect('cleitinho-matador', 'Cleitinho Matador', 'Capanga', 'O maxilar pesado e a cicatriz dispensam apresentação.', { sex: 'masculino', hair: 'raspado', hobby: 'musica', feature: 'olhar-intenso', vehicle: 'moto' }),
  suspect('vanzeira', 'Vanzeira', 'Celebridade do submundo', 'Dentes dourados, correntes enormes e discrição nenhuma.', { sex: 'masculino', hair: 'raspado', hobby: 'vida-noturna', feature: 'joias-exageradas', vehicle: 'carro-de-luxo' })
];

export const traitLabels: Record<TraitCategory, string> = {
  sex: 'Sexo', hair: 'Cabelo', hobby: 'Hobby', feature: 'Característica', vehicle: 'Veículo'
};

export const traitValueLabels: Record<string, string> = {
  feminino: 'Feminino', masculino: 'Masculino', loiro: 'Loiro', preto: 'Preto', raspado: 'Raspado',
  colecionismo: 'Colecionismo', 'vida-noturna': 'Vida noturna', musica: 'Música',
  'joias-exageradas': 'Joias exageradas', 'olhar-intenso': 'Olhar intenso', 'rosto-marcante': 'Rosto marcante',
  'carro-de-luxo': 'Carro de luxo', moto: 'Motocicleta', 'veiculo-customizado': 'Veículo customizado'
};
