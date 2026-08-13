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
  suspect('deolane-san-paolo', 'Deolane San Paolo', 'Chefe da Tríade Chapa-Coco', 'Ostentação, maquiagem pesada e joias monumentais tornam sua presença impossível de ignorar.', { sex: 'feminino', hair: 'loiro-liso', hobby: 'alta-sociedade', feature: 'joias-exageradas', vehicle: 'carro-de-luxo' }, true),
  suspect('cris-minosa', 'Cris Minosa', 'Operadora sênior', 'Observa muito, fala pouco e deixa um perfume raro por onde passa.', { sex: 'feminino', hair: 'preto-cacheado', hobby: 'colecionismo', feature: 'olhar-intenso', vehicle: 'moto' }),
  suspect('lua-metrayu', 'Lua Metrayu', 'Negociante de arte', 'Especialista em logística discreta e jogos de estratégia.', { sex: 'feminino', hair: 'preto-liso', hobby: 'colecionismo', feature: 'olhar-intenso', vehicle: 'limusine' }),
  suspect('thais-kizita', 'Thais Kizita', 'Infiltradora social', 'Entra em eventos exclusivos sorrindo e sai antes da conta chegar.', { sex: 'feminino', hair: 'castanho', hobby: 'alta-sociedade', feature: 'pinta-no-rosto', vehicle: 'conversivel' }),
  suspect('tigrinia-fonseca', 'Tigrínia Fonseca', 'Frequentadora de cassinos', 'Transforma salões elegantes em mesas de aposta de alto risco.', { sex: 'feminino', hair: 'loiro-liso', hobby: 'apostas', feature: 'sorriso-presuncoso', vehicle: 'conversivel' }),
  suspect('narcola-tamacho', 'Narcola Tamacho', 'Contrabandista', 'Um veterano das rotas de carga, reconhecível pelo nariz enorme.', { sex: 'masculino', hair: 'calvo', hobby: 'apostas', feature: 'nariz-grande', vehicle: 'furgao' }),
  suspect('paulo-escolar', 'Paulo Escolar', 'Fora-da-lei teatral', 'Conta histórias altas, toca violão e cultiva um bigode ainda maior.', { sex: 'masculino', hair: 'preto', hobby: 'musica', feature: 'bigode-grande', vehicle: 'picape' }),
  suspect('zeze-do-rap', 'Zezé do Rap', 'Operador urbano', 'Chega fazendo barulho, rimando álibis e exibindo seu cupê.', { sex: 'masculino', hair: 'preto', hobby: 'musica', feature: 'oculos-escuros', vehicle: 'cupe' }),
  suspect('cleitinho-matador', 'Cleitinho Matador', 'Capanga', 'O maxilar pesado e a cicatriz dispensam apresentação.', { sex: 'masculino', hair: 'raspado', hobby: 'colecionismo', feature: 'olhar-intenso', vehicle: 'moto' }),
  suspect('vanzeira', 'Vanzeira', 'Celebridade do submundo', 'Dentes dourados, correntes enormes e discrição nenhuma.', { sex: 'masculino', hair: 'raspado', hobby: 'festas', feature: 'joias-exageradas', vehicle: 'carro-de-luxo' })
];

export const traitLabels: Record<TraitCategory, string> = {
  sex: 'Sexo', hair: 'Cabelo', hobby: 'Hobby', feature: 'Característica', vehicle: 'Veículo'
};

export const traitValueLabels: Record<string, string> = {
  feminino: 'Feminino', masculino: 'Masculino', 'loiro-liso': 'Loiro liso', 'preto-cacheado': 'Preto cacheado',
  'preto-liso': 'Preto liso', castanho: 'Castanho', calvo: 'Calvo', preto: 'Preto', raspado: 'Raspado',
  'alta-sociedade': 'Alta sociedade', colecionismo: 'Colecionismo', apostas: 'Apostas', musica: 'Música', festas: 'Festas',
  'joias-exageradas': 'Joias exageradas', 'olhar-intenso': 'Olhar intenso', 'pinta-no-rosto': 'Pinta no rosto',
  'sorriso-presuncoso': 'Sorriso presunçoso', 'nariz-grande': 'Nariz grande', 'bigode-grande': 'Bigode grande',
  'oculos-escuros': 'Óculos escuros',
  'carro-de-luxo': 'Carro de luxo', moto: 'Motocicleta', limusine: 'Limusine', conversivel: 'Conversível',
  furgao: 'Furgão', picape: 'Picape', cupe: 'Cupê'
};

export const traitClueTexts: Record<string, string> = {
  feminino: 'Eu vi que era uma mulher.',
  masculino: 'Eu vi que era um homem.',
  'loiro-liso': 'Notei que a pessoa possuía cabelo loiro e liso.',
  'preto-cacheado': 'Notei que a pessoa possuía cabelo preto e cacheado.',
  'preto-liso': 'Notei que a pessoa possuía cabelo preto e liso.',
  castanho: 'Notei que a pessoa possuía cabelo castanho.',
  calvo: 'Notei que a pessoa era quase calva.',
  preto: 'Notei que a pessoa possuía cabelo preto.',
  raspado: 'Notei que a pessoa possuía cabelo raspado.',
  'alta-sociedade': 'Ouvi a pessoa falar sobre eventos da alta sociedade.',
  colecionismo: 'Ouvi a pessoa falar sobre sua coleção.',
  apostas: 'Ouvi a pessoa comentar sobre apostas.',
  musica: 'Ouvi a pessoa falar sobre música.',
  festas: 'Ouvi a pessoa comentar sobre festas.',
  'joias-exageradas': 'Eu vi que a pessoa usava joias exageradas.',
  'olhar-intenso': 'Lembro bem do olhar intenso da pessoa.',
  'pinta-no-rosto': 'Lembro de uma pinta no rosto da pessoa.',
  'sorriso-presuncoso': 'Lembro do sorriso presunçoso da pessoa.',
  'nariz-grande': 'Lembro do nariz muito grande da pessoa.',
  'bigode-grande': 'Lembro do grande bigode da pessoa.',
  'oculos-escuros': 'Eu vi que a pessoa usava óculos escuros.',
  'carro-de-luxo': 'Eu vi a pessoa partir em um carro de luxo.',
  moto: 'Eu vi a pessoa partir em uma motocicleta.',
  limusine: 'Eu vi a pessoa partir em uma limusine.',
  conversivel: 'Eu vi a pessoa partir em um conversível.',
  furgao: 'Eu vi a pessoa partir em um furgão.',
  picape: 'Eu vi a pessoa partir em uma picape.',
  cupe: 'Eu vi a pessoa partir em um cupê.'
};
