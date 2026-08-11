import type { City } from '../types';

const allPlaces = [
  'airport', 'bank', 'foreign-ministry', 'harbor', 'hotel', 'library',
  'marketplace', 'museum', 'palace', 'riverfront', 'sports-club', 'stock-exchange'
] as const;

type CityRow = readonly [string, string, string, string, number, number, string, string, string];

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

export const cities: readonly City[] = rows.map((row, index) => {
  const [id, name, country, region, x, y, ...facts] = row;
  const rotated = [...allPlaces.slice(index % allPlaces.length), ...allPlaces.slice(0, index % allPlaces.length)];
  return {
    id, name, country, region, coordinates: { x, y },
    allowedPlaceIds: rotated.slice(0, 8),
    artworkAssetId: `city-${id}`,
    facts: facts.map((text, factIndex) => ({
      id: `${id}-fact-${factIndex + 1}`,
      text,
      compatibleCityIds: [id],
      difficulty: factIndex === 0 ? 'easy' : factIndex === 1 ? 'medium' : 'hard'
    }))
  } satisfies City;
});

export const cityIds = cities.map((city) => city.id);

