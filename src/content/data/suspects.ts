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
  suspect('deolane-san-paolo', 'Deolane San Paolo', 'Chefe da Tríade Chapa-Coco', 'Ostentação, maquiagem pesada e joias monumentais tornam sua presença impossível de ignorar.', { sex: 'feminino', hair: 'loiro', hobby: 'colecionar-luxo', feature: 'joias-exageradas', vehicle: 'carro-de-luxo' }, true),
  suspect('cris-minosa', 'Cris Minosa', 'Operadora sênior', 'Observa muito, fala pouco e deixa um perfume raro por onde passa.', { sex: 'feminino', hair: 'preto-cacheado', hobby: 'colecionar-perfumes', feature: 'olhar-intenso', vehicle: 'moto' }),
  suspect('lua-metrayu', 'Lua Metrayu', 'Negociante de arte', 'Especialista em logística discreta e jogos de estratégia.', { sex: 'feminino', hair: 'preto-liso', hobby: 'jogos-de-estrategia', feature: 'postura-refinada', vehicle: 'limusine' }),
  suspect('thais-kizita', 'Thais Kizita', 'Infiltradora social', 'Entra em eventos exclusivos sorrindo e sai antes da conta chegar.', { sex: 'feminino', hair: 'castanho', hobby: 'eventos-de-moda', feature: 'pinta-no-rosto', vehicle: 'conversivel' }),
  suspect('tigrinia-fonseca', 'Tigrínia Fonseca', 'Frequentadora de cassinos', 'Transforma salões elegantes em mesas de aposta de alto risco.', { sex: 'feminino', hair: 'loiro', hobby: 'jogos-de-azar', feature: 'sorriso-presuncoso', vehicle: 'conversivel' }),
  suspect('narcola-tamacho', 'Narcola Tamacho', 'Contrabandista', 'Um veterano das rotas de carga, reconhecível pelo nariz enorme.', { sex: 'masculino', hair: 'calvo', hobby: 'apostar-em-cavalos', feature: 'nariz-grande', vehicle: 'furgao' }),
  suspect('paulo-escolar', 'Paulo Escolar', 'Fora-da-lei teatral', 'Conta histórias altas, toca violão e cultiva um bigode ainda maior.', { sex: 'masculino', hair: 'preto', hobby: 'tocar-violao', feature: 'bigode-grande', vehicle: 'picape' }),
  suspect('zeze-do-rap', 'Zezé do Rap', 'Operador urbano', 'Chega fazendo barulho, rimando álibis e exibindo seu cupê.', { sex: 'masculino', hair: 'preto', hobby: 'fazer-rap', feature: 'oculos-escuros', vehicle: 'cupe' }),
  suspect('cleitinho-matador', 'Cleitinho Matador', 'Capanga', 'O maxilar pesado e a cicatriz dispensam apresentação.', { sex: 'masculino', hair: 'raspado', hobby: 'colecionar-facas', feature: 'cicatriz', vehicle: 'moto' }),
  suspect('vanzeira', 'Vanzeira', 'Celebridade do submundo', 'Dentes dourados, correntes enormes e discrição nenhuma.', { sex: 'masculino', hair: 'raspado', hobby: 'festas', feature: 'joias-exageradas', vehicle: 'carro-de-luxo' })
];

export const traitLabels: Record<TraitCategory, string> = {
  sex: 'Sexo', hair: 'Cabelo', hobby: 'Hobby', feature: 'Característica', vehicle: 'Veículo'
};

export const traitValueLabels: Record<string, string> = {
  feminino: 'Feminino', masculino: 'Masculino', loiro: 'Loiro', 'preto-cacheado': 'Preto cacheado',
  'preto-liso': 'Preto liso', castanho: 'Castanho', calvo: 'Calvo', preto: 'Preto', raspado: 'Raspado',
  'colecionar-luxo': 'Colecionar luxo', 'colecionar-perfumes': 'Colecionar perfumes',
  'jogos-de-estrategia': 'Jogos de estratégia', 'eventos-de-moda': 'Eventos de moda',
  'jogos-de-azar': 'Jogos de azar', 'apostar-em-cavalos': 'Apostas em cavalos', 'tocar-violao': 'Tocar violão',
  'fazer-rap': 'Fazer rap', 'colecionar-facas': 'Colecionar facas', festas: 'Festas',
  'joias-exageradas': 'Joias exageradas', 'olhar-intenso': 'Olhar intenso', 'postura-refinada': 'Postura refinada',
  'pinta-no-rosto': 'Pinta no rosto', 'sorriso-presuncoso': 'Sorriso presunçoso', 'nariz-grande': 'Nariz grande',
  'bigode-grande': 'Bigode grande', 'oculos-escuros': 'Óculos escuros', cicatriz: 'Cicatriz',
  'carro-de-luxo': 'Carro de luxo', moto: 'Motocicleta', limusine: 'Limusine', conversivel: 'Conversível',
  furgao: 'Furgão', picape: 'Picape', cupe: 'Cupê'
};
