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
  const rotated = [...allPlaces.slice(index % allPlaces.length), ...allPlaces.slice(0, index % allPlaces.length)];
  return {
    id, name, country, region, coordinates: { x, y },
    allowedPlaceIds: rotated.slice(0, 8),
    artworkAssetId: `city-${id}`,
    brief: briefs[id]!,
    facts: facts.map((text, factIndex) => ({
      id: `${id}-fact-${factIndex + 1}`,
      text,
      compatibleCityIds: [id],
      difficulty: factIndex === 0 ? 'easy' : factIndex === 1 ? 'medium' : 'hard'
    }))
  } satisfies City;
});

export const cityIds = cities.map((city) => city.id);
