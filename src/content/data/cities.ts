import type { City, GeographicClueCategory } from '../types';

const allPlaces = [
  'airport', 'bank', 'foreign-ministry', 'harbor', 'hotel', 'library',
  'marketplace', 'museum', 'palace', 'riverfront', 'sports-club', 'stock-exchange'
] as const;

type CityRow = readonly [string, string, string, string, number, number, string, string, string];

interface FlagClue {
  text: string;
  compatibleCityIds: readonly string[];
}

type SupplementalCategory = Exclude<GeographicClueCategory, 'currency' | 'landmark' | 'culture' | 'flag'>;
type SupplementalProfile = Readonly<Record<SupplementalCategory, string>>;

const redWhiteBlue = ['london', 'moscow', 'sydney', 'reykjavik', 'new-york', 'paris', 'bangkok', 'oslo'] as const;
const greenWhiteRed = ['mexico-city', 'rome', 'budapest'] as const;
const redWhiteBlack = ['baghdad', 'cairo'] as const;
const blueWhite = ['buenos-aires', 'san-marino', 'athens'] as const;

const flagClues: Readonly<Record<string, FlagClue>> = {
  'mexico-city': { text: 'Eu vi uma bandeira verde, branca e vermelha presa à bagagem.', compatibleCityIds: greenWhiteRed },
  london: { text: 'Eu vi uma bandeira azul, branca e vermelha presa à bagagem.', compatibleCityIds: redWhiteBlue },
  moscow: { text: 'Eu vi uma bandeira azul, branca e vermelha presa à bagagem.', compatibleCityIds: redWhiteBlue },
  istanbul: { text: 'Eu vi uma bandeira vermelha com uma lua crescente e uma estrela.', compatibleCityIds: ['istanbul'] },
  baghdad: { text: 'Eu vi uma bandeira vermelha, branca e preta presa à bagagem.', compatibleCityIds: redWhiteBlack },
  tokyo: { text: 'Eu vi uma bandeira branca com um disco vermelho no centro.', compatibleCityIds: ['tokyo'] },
  'port-moresby': { text: 'Eu vi uma bandeira dividida na diagonal, com uma ave-do-paraíso e estrelas.', compatibleCityIds: ['port-moresby'] },
  'new-delhi': { text: 'Eu vi uma bandeira açafrão, branca e verde com uma roda azul no centro.', compatibleCityIds: ['new-delhi'] },
  'buenos-aires': { text: 'Eu vi que carregava uma bandeira azul e branca com um sol no centro.', compatibleCityIds: ['buenos-aires'] },
  sydney: { text: 'Eu vi uma bandeira azul, branca e vermelha presa à bagagem.', compatibleCityIds: redWhiteBlue },
  'san-marino': { text: 'Eu vi uma bandeira azul e branca presa à bagagem.', compatibleCityIds: blueWhite },
  singapore: { text: 'Eu vi uma bandeira vermelha e branca com uma lua crescente e cinco estrelas.', compatibleCityIds: ['singapore'] },
  rome: { text: 'Eu vi uma bandeira verde, branca e vermelha presa à bagagem.', compatibleCityIds: greenWhiteRed },
  reykjavik: { text: 'Eu vi uma bandeira azul, branca e vermelha presa à bagagem.', compatibleCityIds: redWhiteBlue },
  beijing: { text: 'Eu vi uma bandeira vermelha com cinco estrelas amarelas.', compatibleCityIds: ['beijing'] },
  montreal: { text: 'Eu vi uma bandeira com uma folha vermelha no centro.', compatibleCityIds: ['montreal'] },
  lima: { text: 'Eu vi uma bandeira com duas faixas vermelhas separadas por uma faixa branca.', compatibleCityIds: ['lima'] },
  'new-york': { text: 'Eu vi uma bandeira azul, branca e vermelha presa à bagagem.', compatibleCityIds: redWhiteBlue },
  paris: { text: 'Eu vi uma bandeira azul, branca e vermelha presa à bagagem.', compatibleCityIds: redWhiteBlue },
  colombo: { text: 'Eu vi uma bandeira com um leão dourado segurando uma espada.', compatibleCityIds: ['colombo'] },
  budapest: { text: 'Eu vi uma bandeira verde, branca e vermelha presa à bagagem.', compatibleCityIds: greenWhiteRed },
  kathmandu: { text: 'Eu vi uma bandeira formada por dois triângulos sobrepostos.', compatibleCityIds: ['kathmandu'] },
  bangkok: { text: 'Eu vi uma bandeira azul, branca e vermelha presa à bagagem.', compatibleCityIds: redWhiteBlue },
  cairo: { text: 'Eu vi uma bandeira vermelha, branca e preta presa à bagagem.', compatibleCityIds: redWhiteBlack },
  athens: { text: 'Eu vi uma bandeira azul e branca presa à bagagem.', compatibleCityIds: blueWhite },
  'rio-de-janeiro': { text: 'Eu vi uma bandeira verde e amarela com um globo azul no centro.', compatibleCityIds: ['rio-de-janeiro'] },
  kigali: { text: 'Eu vi uma bandeira azul, amarela e verde com um sol no alto.', compatibleCityIds: ['kigali'] },
  bamako: { text: 'Eu vi uma bandeira com faixas verticais verde, amarela e vermelha.', compatibleCityIds: ['bamako'] },
  moroni: { text: 'Eu vi uma bandeira de quatro cores com um crescente e quatro estrelas.', compatibleCityIds: ['moroni'] },
  oslo: { text: 'Eu vi uma bandeira vermelha com uma cruz azul contornada de branco.', compatibleCityIds: ['oslo'] }
};

const supplementalProfiles: Readonly<Record<string, SupplementalProfile>> = {
  'mexico-city': { language: 'espanhol', history: 'a civilização asteca', geography: 'explorar o planalto central e seus vulcões', 'fauna-flora': 'axolotes e borboletas-monarca', food: 'mole poblano', government: 'uma república federal presidencial', commodity: 'prata e automóveis', 'book-topic': 'os astecas', artifact: 'artefatos astecas' },
  london: { language: 'inglês', history: 'a Revolução Industrial', geography: 'navegar pelo Tâmisa', 'fauna-flora': 'cervos-vermelhos e carvalhos', food: 'fish and chips', government: 'uma monarquia constitucional parlamentar', commodity: 'máquinas e produtos farmacêuticos', 'book-topic': 'os druidas e a história britânica', artifact: 'artefatos celtas' },
  moscow: { language: 'russo', history: 'os czares e a era soviética', geography: 'percorrer o Volga e os Montes Urais', 'fauna-flora': 'ursos-pardos e bétulas', food: 'borsch', government: 'uma república federal', commodity: 'petróleo, gás e trigo', 'book-topic': 'os czares', artifact: 'tesouros imperiais' },
  istanbul: { language: 'turco', history: 'os impérios Bizantino e Otomano', geography: 'cruzar o Bósforo', 'fauna-flora': 'leopardos-da-anatólia e tulipas', food: 'kebab', government: 'uma república presidencial', commodity: 'avelãs e tecidos', 'book-topic': 'Constantinopla', artifact: 'artefatos bizantinos' },
  baghdad: { language: 'árabe', history: 'a Mesopotâmia e o Califado Abássida', geography: 'navegar pelos rios Tigre e Eufrates', 'fauna-flora': 'gazelas-arábias e tamareiras', food: 'masgouf', government: 'uma república federal parlamentar', commodity: 'petróleo e tâmaras', 'book-topic': 'sumérios e babilônios', artifact: 'artefatos mesopotâmicos' },
  tokyo: { language: 'japonês', history: 'os xogunatos e o período Edo', geography: 'avistar o Monte Fuji', 'fauna-flora': 'grous e cerejeiras', food: 'sushi', government: 'uma monarquia constitucional parlamentar', commodity: 'automóveis e eletrônicos', 'book-topic': 'os xoguns', artifact: 'armaduras samurais' },
  'port-moresby': { language: 'tok pisin', history: 'os povos ancestrais da Melanésia', geography: 'explorar as terras altas e o Mar de Coral', 'fauna-flora': 'aves-do-paraíso e orquídeas', food: 'mumu', government: 'uma monarquia constitucional parlamentar', commodity: 'ouro, cobre e café', 'book-topic': 'a diversidade cultural da Melanésia', artifact: 'máscaras entalhadas' },
  'new-delhi': { language: 'hindi', history: 'o Império Mogol e a independência', geography: 'percorrer o Himalaia e a planície do Ganges', 'fauna-flora': 'tigres-de-bengala e pavões', food: 'pratos com masala', government: 'uma república federal parlamentar', commodity: 'especiarias e tecidos', 'book-topic': 'o Império Mogol', artifact: 'artefatos mogóis' },
  'buenos-aires': { language: 'espanhol', history: 'os gauchos e a independência argentina', geography: 'navegar pelo Rio da Prata e atravessar os pampas', 'fauna-flora': 'horneros e ceibos', food: 'empanadas', government: 'uma república federal presidencial', commodity: 'soja, carne bovina e vinho', 'book-topic': 'os gauchos', artifact: 'prataria colonial' },
  sydney: { language: 'inglês', history: 'os povos aborígenes e a colonização', geography: 'explorar o outback e a Grande Barreira de Coral', 'fauna-flora': 'cangurus e eucaliptos', food: 'tortas de carne', government: 'uma monarquia constitucional parlamentar', commodity: 'minério de ferro e lã', 'book-topic': 'a história aborígene', artifact: 'arte aborígene' },
  'san-marino': { language: 'italiano', history: 'a mais antiga república europeia', geography: 'subir o Monte Titano', 'fauna-flora': 'falcões-peregrinos e oliveiras', food: 'torta tre monti', government: 'uma república parlamentar', commodity: 'cerâmica, selos e vinho', 'book-topic': 'a república medieval', artifact: 'moedas e selos históricos' },
  singapore: { language: 'inglês', history: 'a história do comércio marítimo', geography: 'percorrer os jardins e a baía', 'fauna-flora': 'orquídeas e lontras', food: 'laksa', government: 'uma república parlamentar', commodity: 'eletrônicos e petróleo refinado', 'book-topic': 'a história de seu porto', artifact: 'artefatos peranakan' },
  rome: { language: 'italiano', history: 'o Império Romano e o Renascimento', geography: 'percorrer os Apeninos e o rio Pó', 'fauna-flora': 'lobos e oliveiras', food: 'pasta carbonara', government: 'uma república parlamentar', commodity: 'vinho, máquinas e mármore', 'book-topic': 'etruscos e romanos', artifact: 'artefatos romanos' },
  reykjavik: { language: 'islandês', history: 'os vikings e o Althing', geography: 'visitar gêiseres e campos de lava', 'fauna-flora': 'papagaios-do-mar e tremoceiros', food: 'skyr', government: 'uma república parlamentar', commodity: 'pescado e alumínio', 'book-topic': 'as sagas islandesas', artifact: 'artefatos vikings' },
  beijing: { language: 'mandarim', history: 'as dinastias imperiais', geography: 'caminhar pela Grande Muralha', 'fauna-flora': 'pandas-gigantes e peônias', food: 'pato de Pequim', government: 'uma república socialista', commodity: 'eletrônicos, aço e chá', 'book-topic': 'as dinastias chinesas', artifact: 'porcelana imperial' },
  montreal: { language: 'francês', history: 'a Nova França', geography: 'navegar pelo rio São Lourenço', 'fauna-flora': 'alces e bordos', food: 'poutine', government: 'uma monarquia constitucional parlamentar', commodity: 'madeira e potássio', 'book-topic': 'a Nova França', artifact: 'artefatos indígenas e coloniais' },
  lima: { language: 'espanhol', history: 'os incas e a conquista espanhola', geography: 'cruzar os Andes e a costa do Pacífico', 'fauna-flora': 'vicunhas e quinas', food: 'ceviche', government: 'uma república presidencial', commodity: 'cobre, café e pescado', 'book-topic': 'os incas', artifact: 'tecidos incas' },
  'new-york': { language: 'inglês', history: 'a imigração e a industrialização', geography: 'navegar pelo Hudson', 'fauna-flora': 'águias-carecas e sequoias', food: 'cachorro-quente', government: 'uma república federal presidencial', commodity: 'aeronaves, milho e tecnologia', 'book-topic': 'a história da imigração', artifact: 'arte indígena e moderna' },
  paris: { language: 'francês', history: 'os francos e a Revolução Francesa', geography: 'navegar pelo Sena e visitar os Alpes', 'fauna-flora': 'galos e lavandas', food: 'croissants', government: 'uma república semipresidencial', commodity: 'vinho, perfume e aeronaves', 'book-topic': 'a Revolução Francesa', artifact: 'artefatos francos' },
  colombo: { language: 'cingalês', history: 'os antigos reinos do Ceilão', geography: 'explorar o oceano Índico e as terras altas', 'fauna-flora': 'elefantes e pés de chá', food: 'kottu', government: 'uma república semipresidencial', commodity: 'chá, borracha e canela', 'book-topic': 'o antigo Ceilão', artifact: 'artefatos budistas' },
  budapest: { language: 'húngaro', history: 'os magiares e o Império Austro-Húngaro', geography: 'navegar pelo Danúbio e visitar fontes termais', 'fauna-flora': 'abetardas e páprica', food: 'goulash', government: 'uma república parlamentar', commodity: 'automóveis, remédios e vinho', 'book-topic': 'os magiares', artifact: 'artefatos magiares' },
  kathmandu: { language: 'nepalês', history: 'os antigos reinos do Himalaia', geography: 'caminhar pelo Himalaia', 'fauna-flora': 'rinocerontes e rododendros', food: 'momo', government: 'uma república federal parlamentar', commodity: 'tapetes, chá e cardamomo', 'book-topic': 'os gurkhas e o Himalaia', artifact: 'artefatos hindus e budistas' },
  bangkok: { language: 'tailandês', history: 'o antigo Sião e Ayutthaya', geography: 'navegar pelo Chao Phraya', 'fauna-flora': 'elefantes e orquídeas', food: 'pad thai', government: 'uma monarquia constitucional', commodity: 'arroz, borracha e eletrônicos', 'book-topic': 'o antigo Sião', artifact: 'artefatos budistas' },
  cairo: { language: 'árabe', history: 'os faraós e o Egito Antigo', geography: 'navegar pelo Nilo e atravessar o Saara', 'fauna-flora': 'crocodilos e papiros', food: 'koshari', government: 'uma república semipresidencial', commodity: 'algodão, petróleo e frutas cítricas', 'book-topic': 'o Egito Antigo', artifact: 'artefatos faraônicos' },
  athens: { language: 'grego', history: 'as antigas cidades-estado', geography: 'navegar pelo Egeu e visitar o Monte Olimpo', 'fauna-flora': 'oliveiras e tartarugas-cabeçudas', food: 'moussaka', government: 'uma república parlamentar', commodity: 'azeitonas, navios e remédios', 'book-topic': 'Platão e Esparta', artifact: 'artefatos da Grécia Antiga' },
  'rio-de-janeiro': { language: 'português', history: 'os povos indígenas e o período imperial', geography: 'explorar a Mata Atlântica e a costa', 'fauna-flora': 'onças-pintadas e araras', food: 'feijoada', government: 'uma república federal presidencial', commodity: 'café, soja e minério de ferro', 'book-topic': 'a Amazônia e os povos indígenas', artifact: 'artefatos indígenas e imperiais' },
  kigali: { language: 'kinyarwanda', history: 'os antigos reinos e a reconstrução nacional', geography: 'atravessar as Mil Colinas', 'fauna-flora': 'gorilas-das-montanhas e acácias', food: 'isombe', government: 'uma república presidencial', commodity: 'café, chá e estanho', 'book-topic': 'os povos dos Grandes Lagos', artifact: 'cestaria tradicional' },
  bamako: { language: 'bambara', history: 'o Império do Mali e Timbuktu', geography: 'navegar pelo Níger e atravessar o Sahel', 'fauna-flora': 'baobás e elefantes-do-deserto', food: 'tigadèguèna', government: 'um Estado unitário', commodity: 'ouro e algodão', 'book-topic': 'o Império do Mali', artifact: 'artefatos tuaregues e mandês' },
  moroni: { language: 'comoriano', history: 'os antigos sultanatos do Índico', geography: 'subir o vulcão Karthala', 'fauna-flora': 'celacantos e ylang-ylang', food: 'lagosta com baunilha', government: 'uma república federal presidencial', commodity: 'baunilha, cravo e ylang-ylang', 'book-topic': 'os sultanatos do oceano Índico', artifact: 'artefatos islâmicos insulares' },
  oslo: { language: 'norueguês', history: 'os vikings e a formação da Noruega', geography: 'navegar pelos fiordes', 'fauna-flora': 'renas e pinheiros', food: 'salmão', government: 'uma monarquia constitucional parlamentar', commodity: 'petróleo, pescado e alumínio', 'book-topic': 'Ibsen e os vikings', artifact: 'artefatos vikings' }
};

const supplementalTemplates: Readonly<Record<SupplementalCategory, (value: string) => string>> = {
  language: (value) => `Eu ouvi a pessoa pedir um dicionário de ${value}.`,
  history: (value) => `Eu ouvi que pretendia estudar ${value}.`,
  geography: (value) => `Eu ouvi planos de ${value}.`,
  'fauna-flora': (value) => `Eu ouvi perguntas sobre ${value}.`,
  food: (value) => `Eu ouvi que pretendia provar ${value}.`,
  government: (value) => `Eu ouvi referências a ${value}.`,
  commodity: (value) => `Eu vi documentos de carga mencionando ${value}.`,
  'book-topic': (value) => `Eu vi um pedido de livros sobre ${value}.`,
  artifact: (value) => `Eu ouvi perguntas sobre ${value}.`
};

const supplementalDifficulty: Readonly<Record<SupplementalCategory, 'easy' | 'medium' | 'hard'>> = {
  language: 'easy', government: 'easy', geography: 'medium', food: 'medium', commodity: 'medium',
  history: 'hard', 'fauna-flora': 'hard', 'book-topic': 'hard', artifact: 'hard'
};

const supplementalCategories = Object.keys(supplementalTemplates) as SupplementalCategory[];

const rows: readonly CityRow[] = [
  ['mexico-city', 'Cidade do México', 'México', 'north-america', .17, .40, 'Trocaram notas por pesos mexicanos.', 'Perguntaram pelo Zócalo e suas pedras antigas.', 'Falavam espanhol e queriam provar mole poblano.'],
  ['london', 'Londres', 'Reino Unido', 'europe', .47, .25, 'Procuravam libras esterlinas.', 'Comentaram o relógio no Palácio de Westminster.', 'Queriam atravessar o Tâmisa sob uma chuva fina.'],
  ['moscow', 'Moscou', 'Rússia', 'europe', .61, .22, 'Precisavam de rublos.', 'Descreveram as cúpulas coloridas da Praça Vermelha.', 'Levaram um casaco para o frio às margens do Moscova.'],
  ['istanbul', 'Istambul', 'Turquia', 'middle-east', .56, .35, 'Pediam liras turcas.', 'Queriam ver uma basílica transformada em mesquita.', 'Falavam em cruzar o Bósforo entre dois continentes.'],
  ['baghdad', 'Bagdá', 'Iraque', 'middle-east', .60, .40, 'Perguntaram por dinares iraquianos.', 'Seguiam o curso do Tigre.', 'Procuravam histórias da antiga Casa da Sabedoria.'],
  ['tokyo', 'Tóquio', 'Japão', 'asia', .84, .36, 'Trocaram dinheiro por ienes.', 'Perguntaram por trens-bala e letreiros de Shibuya.', 'Queriam ver o Monte Fuji ao longe.'],
  ['port-moresby', 'Port Moresby', 'Papua-Nova Guiné', 'oceania', .89, .65, 'Precisavam de kina.', 'Ouviram falar mais de oitocentas línguas no país.', 'Procuravam recifes no Mar de Coral.'],
  ['new-delhi', 'Nova Délhi', 'Índia', 'asia', .70, .43, 'Trocaram notas por rúpias indianas.', 'Perguntaram pelo Portão da Índia.', 'Queriam provar pratos com masala na capital.'],
  ['buenos-aires', 'Buenos Aires', 'Argentina', 'south-america', .30, .72, 'Pediam pesos argentinos.', 'Procuravam uma casa de tango perto do Prata.', 'Comentaram as avenidas largas e o obelisco.'],
  ['sydney', 'Sydney', 'Austrália', 'oceania', .93, .76, 'Precisavam de dólares australianos.', 'Desenharam velas brancas de uma ópera sobre o porto.', 'Perguntaram por uma ponte de aço sobre a baía.'],
  ['san-marino', 'San Marino', 'San Marino', 'europe', .52, .33, 'Levaram euros para uma república minúscula.', 'Queriam subir ao Monte Titano.', 'Procuravam três torres medievais sobre a montanha.'],
  ['singapore', 'Singapura', 'Singapura', 'asia', .80, .55, 'Trocaram dinheiro por dólares de Singapura.', 'Perguntaram pelo leão com cauda de peixe.', 'Queriam visitar jardins futuristas junto à baía.'],
  ['rome', 'Roma', 'Itália', 'europe', .51, .35, 'Pagariam em euros.', 'Perguntaram por um anfiteatro de gladiadores.', 'Jogariam uma moeda numa fonte barroca.'],
  ['reykjavik', 'Reykjavík', 'Islândia', 'europe', .39, .17, 'Precisavam de coroas islandesas.', 'Procuravam gêiseres e campos de lava.', 'Queriam uma igreja que lembra colunas de basalto.'],
  ['beijing', 'Pequim', 'China', 'asia', .78, .31, 'Trocaram notas por yuans.', 'Perguntaram pela Cidade Proibida.', 'Queriam caminhar por uma muralha que cruza montanhas.'],
  ['montreal', 'Montreal', 'Canadá', 'north-america', .27, .27, 'Usariam dólares canadenses.', 'Alternavam entre francês e inglês.', 'Procuravam a basílica de Notre-Dame no velho porto.'],
  ['lima', 'Lima', 'Peru', 'south-america', .21, .62, 'Pediam soles peruanos.', 'Falavam de uma cidade coberta por garúa.', 'Queriam provar ceviche à beira do Pacífico.'],
  ['new-york', 'Nova York', 'Estados Unidos', 'north-america', .29, .34, 'Levavam dólares americanos.', 'Perguntaram por uma estátua com uma tocha no porto.', 'Queriam ver arranha-céus em Manhattan.'],
  ['paris', 'Paris', 'França', 'europe', .48, .31, 'Pagariam em euros.', 'Descreveram uma torre de ferro junto ao Sena.', 'Queriam visitar o Louvre e suas pirâmides de vidro.'],
  ['colombo', 'Colombo', 'Sri Lanka', 'asia', .72, .56, 'Precisavam de rúpias do Sri Lanka.', 'Perguntaram por chá do Ceilão.', 'Procuravam templos e o oceano Índico.'],
  ['budapest', 'Budapeste', 'Hungria', 'europe', .55, .30, 'Trocaram notas por florins.', 'Queriam atravessar o Danúbio numa ponte de correntes.', 'Perguntaram por banhos termais.'],
  ['kathmandu', 'Katmandu', 'Nepal', 'asia', .72, .39, 'Pediam rúpias nepalesas.', 'Procuravam olhos pintados em estupas.', 'Queriam avistar o Himalaia.'],
  ['bangkok', 'Bangkok', 'Tailândia', 'asia', .78, .49, 'Precisavam de bahts.', 'Perguntaram por templos dourados no Chao Phraya.', 'Queriam provar comida de rua muito apimentada.'],
  ['cairo', 'Cairo', 'Egito', 'africa', .55, .45, 'Trocaram dinheiro por libras egípcias.', 'Procuravam pirâmides na margem do Nilo.', 'Perguntaram por uma esfinge de pedra.'],
  ['athens', 'Atenas', 'Grécia', 'europe', .54, .38, 'Pagariam em euros.', 'Queriam subir a uma acrópole coroada por colunas.', 'Falavam de mitos e do mar Egeu.'],
  ['rio-de-janeiro', 'Rio de Janeiro', 'Brasil', 'south-america', .32, .63, 'Precisavam de reais.', 'Descreveram uma estátua de braços abertos no Corcovado.', 'Queriam ver o Pão de Açúcar junto à Guanabara.'],
  ['kigali', 'Kigali', 'Ruanda', 'africa', .57, .60, 'Trocaram notas por francos ruandeses.', 'Perguntaram por colinas verdes no coração da África.', 'Queriam observar gorilas-das-montanhas no país.'],
  ['bamako', 'Bamako', 'Mali', 'africa', .46, .51, 'Pediam francos CFA.', 'Seguiam o grande rio Níger.', 'Procuravam música de griôs no Sahel.'],
  ['moroni', 'Moroni', 'Comores', 'africa', .64, .65, 'Precisavam de francos comorianos.', 'Procuravam uma cidade sob o vulcão Karthala.', 'Falavam de ilhas perfumadas por ylang-ylang.'],
  ['oslo', 'Oslo', 'Noruega', 'europe', .51, .18, 'Trocaram dinheiro por coroas norueguesas.', 'Perguntaram por fiordes e navios viquingues.', 'Queriam ver esculturas no parque Vigeland.']
];

const briefs: Readonly<Record<string, string>> = {
  'mexico-city': 'Grande metrópole de planalto, reúne universidades, manufatura, serviços e uma vida cultural marcada por mercados, artes populares e culinária regional.',
  london: 'Centro internacional de finanças, imprensa e artes cênicas, combina bairros históricos com tecnologia, moda e uma extensa economia de serviços.',
  moscow: 'Metrópole continental de forte tradição literária e musical, concentra pesquisa, engenharia, administração e grandes instituições culturais.',
  istanbul: 'A herança bizantina e otomana convive com comércio marítimo, oficinas têxteis, gastronomia e uma movimentada produção cultural contemporânea.',
  baghdad: 'Capital de antiga tradição intelectual, mantém papel central na administração, no comércio, nas universidades, na literatura e nas artes do país.',
  tokyo: 'Uma das maiores economias urbanas do mundo, articula tecnologia, finanças, mídia, design e costumes comunitários em ritmo intenso.',
  'port-moresby': 'Capital tropical voltada à administração e ao comércio portuário, com serviços ligados a mineração, pesca e à diversidade cultural do país.',
  'new-delhi': 'Centro político planejado que reúne administração, diplomacia, artesanato, serviços modernos e uma culinária formada por muitas regiões indianas.',
  'buenos-aires': 'A capital portenha combina editoras, teatro, design, indústria alimentícia e uma vida urbana conhecida por livrarias e cafés movimentados.',
  sydney: 'Cidade costeira de economia diversificada, destaca-se em universidades, audiovisual, tecnologia, turismo e serviços profissionais.',
  'san-marino': 'Pequeno Estado europeu cuja economia mistura turismo, filatelia, cerâmica, bancos e manufaturas de escala familiar.',
  singapore: 'Centro comercial e logístico de alta densidade, reúne finanças, indústria eletrônica, pesquisa e uma cultura culinária de muitas comunidades.',
  rome: 'Capital administrativa e cultural com presença marcante de cinema, moda, gastronomia, universidades e ofícios preservados por gerações.',
  reykjavik: 'Cidade compacta onde pesca, energia renovável, tecnologia e turismo convivem com uma ativa produção de música e literatura.',
  beijing: 'Grande centro político e acadêmico, reúne pesquisa, tecnologia, manufatura avançada e tradições de ópera, caligrafia e culinária do norte.',
  montreal: 'Polo de indústrias criativas, jogos digitais, pesquisa aeroespacial e festivais, com bairros que preservam identidades culturais variadas.',
  lima: 'Capital costeira de forte vocação comercial, reúne têxteis, produção editorial, serviços e uma cozinha urbana formada por muitas influências.',
  'new-york': 'Metrópole global de finanças, mídia, teatro, tecnologia e comércio, formada por bairros de comunidades vindas de muitas partes do mundo.',
  paris: 'Centro de moda, design, pesquisa, gastronomia e artes, com intensa atividade editorial e uma extensa rede de pequenos comércios.',
  colombo: 'Capital comercial com economia apoiada em serviços, transporte portuário, têxteis e mercados que refletem a diversidade cultural da ilha.',
  budapest: 'Polo regional de engenharia, indústria farmacêutica, cinema e serviços, conhecido também por cafés e uma longa tradição musical.',
  kathmandu: 'Centro administrativo e artesanal onde turismo, comércio, festivais religiosos e oficinas familiares sustentam grande parte da vida urbana.',
  bangkok: 'Metrópole de logística, serviços, manufatura leve e entretenimento, com bairros comerciais que funcionam do amanhecer até tarde da noite.',
  cairo: 'Maior centro urbano do mundo árabe, concentra cinema, televisão, comércio, universidades, indústria têxtil e uma intensa vida de bairro.',
  athens: 'Capital de economia apoiada em administração, navegação, turismo, alimentos e serviços, com produção cultural ativa durante todo o ano.',
  'rio-de-janeiro': 'Cidade de forte economia criativa, reúne audiovisual, música, turismo, serviços e centros de pesquisa em uma paisagem urbana diversa.',
  kigali: 'Capital organizada e em rápida transformação, investe em tecnologia, serviços, processamento de café e pequenos negócios regionais.',
  bamako: 'Centro administrativo e comercial com mercados de tecidos, oficinas, produção artesanal e uma cena musical de grande influência regional.',
  moroni: 'Capital insular cuja atividade combina pesca, agricultura tropical, comércio regional, serviços públicos e pequenos negócios familiares.',
  oslo: 'Centro de energia, navegação, tecnologia marítima e design, com políticas urbanas voltadas à pesquisa e à qualidade dos espaços públicos.'
};

export const cities: readonly City[] = rows.map((row, index) => {
  const [id, name, country, region, x, y, ...facts] = row;
  const flagClue = flagClues[id]!;
  const profile = supplementalProfiles[id]!;
  const rotated = [...allPlaces.slice(index % allPlaces.length), ...allPlaces.slice(0, index % allPlaces.length)];
  return {
    id, name, country, region, coordinates: { x, y },
    allowedPlaceIds: rotated.slice(0, 8),
    artworkAssetId: `city-${id}`,
    brief: briefs[id]!,
    facts: [
      ...facts.map((text, factIndex) => ({
        id: `${id}-fact-${factIndex + 1}`,
        category: (['currency', 'landmark', 'culture'] as const)[factIndex]!,
        text,
        compatibleCityIds: [id],
        difficulty: factIndex === 0 ? 'easy' as const : factIndex === 1 ? 'medium' as const : 'hard' as const
      })),
      {
        id: `${id}-fact-flag`,
        category: 'flag' as const,
        text: flagClue.text,
        compatibleCityIds: flagClue.compatibleCityIds,
        difficulty: 'medium'
      },
      ...supplementalCategories.map((category) => ({
        id: `${id}-fact-${category}`,
        category,
        text: supplementalTemplates[category](profile[category]),
        compatibleCityIds: rows
          .filter(([candidateId]) => supplementalProfiles[candidateId]![category] === profile[category])
          .map(([candidateId]) => candidateId),
        difficulty: supplementalDifficulty[category]
      }))
    ]
  } satisfies City;
});

export const cityIds = cities.map((city) => city.id);
