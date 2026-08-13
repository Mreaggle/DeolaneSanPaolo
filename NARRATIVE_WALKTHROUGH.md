# NARRATIVE_WALKTHROUGH.md

## 1. Autoridade

Este documento define a sequência canônica apresentada ao jogador em **Deolane San Paolo**. `GAME_SPEC.md` continua soberano para regras; este arquivo determina estados, ordem, tom e texto-base em português brasileiro.

## 2. Identidades narrativas

- Organização investigativa: **Agência Federal**.
- Facção criminosa: **T.C.C. — Tríade Chapa-Coco**.
- Chefe e alvo final da T.C.C.: **Deolane San Paolo**.

`T.C.C.` significa **Tríade Chapa-Coco** e é o nome público da organização criminosa no jogo.

## 3. Tom

O texto é econômico, levemente teatral e seco, como software de investigação do fim dos anos 1980. O humor vem da seriedade burocrática aplicada a crimes extravagantes. Não são definidos aqui biografia, motivação, família ou origem da Deolane.

## 4. Abertura

### 4.1 Boot

1. Tela preta.
2. A marca sem texto da **Mreaggle Software** surge com fade-in muito curto enquanto o sting começa.
3. Essa primeira marca desaparece progressivamente até `00:00.800` do áudio.
4. Em `00:00.800`, a marca completa da **Mreaggle Software** substitui a anterior.
5. Quando o sting termina, a marca completa realiza um fade-out linear de exatamente 1 segundo.
6. Somente depois desse fade-out aparece o título **DEOLANE SAN PAOLO**.

O sting tenta iniciar automaticamente. Quando a política de autoplay do navegador impedir áudio sem gesto, a tela permanece na marca inicial e solicita clique ou tecla; a cronologia começa junto com a reprodução autorizada. O estado é exclusivamente de apresentação e não cria nem altera perfil, save ou caso.

### 4.2 Título

Comandos:

- `INICIAR`;
- `CONTINUAR`, quando existe perfil salvo;
- `OPÇÕES`;
- `CRÉDITOS`.

`INICIAR` abre o terminal da Agência Federal. Não abre o mapa.

## 5. Primeiro contato

### 5.1 Identificação

O terminal pergunta:

> IDENTIFIQUE-SE, DETETIVE.

O jogador informa um nome de 1 a 14 caracteres visíveis. O texto digitado é validado e renderizado como texto, nunca como HTML.

### 5.2 Busca de registros

Após confirmar:

```text
CONSULTANDO ARQUIVOS...
NOME: {playerName}
```

Para um nome novo:

```text
REGISTRO NÃO ENCONTRADO.
NUNCA VI VOCÊ POR AQUI, {playerName}.
ISSO NORMALMENTE SERIA UM PROBLEMA.
HOJE É UMA CONTRATAÇÃO.
```

O perfil é criado no posto `NOVATO`.

Para um perfil existente:

```text
REGISTRO LOCALIZADO.
DETETIVE {playerName}.
POSTO: {rankName}.
```

Se existe caso ativo, o terminal oferece `RETOMAR CASO`. Caso contrário, segue para um novo boletim.

## 6. Boletim criminal

Uma interrupção sonora e visual mostra:

```text
PLANTÃO INTERNACIONAL
OBJETO ROUBADO: {stolenItemName}
LOCAL DO CRIME: {startCityName}
SUSPEITO: NÃO IDENTIFICADO
FACÇÃO: T.C.C. — TRÍADE CHAPA-COCO
```

O retrato do culpado nunca aparece. O boletim apresenta o objeto e uma arte do local, sem revelar rota, destino ou identidade.

## 7. Designação

A Agência Federal responde:

```text
DETETIVE: {playerName}
POSTO: {rankName}
PARTIDA: {startCityName}
PRAZO: SÁBADO, 09:00 (120 HORAS)

SIGA A ROTA.
IDENTIFIQUE O CULPADO.
OBTENHA O MANDADO.
RECUPERE {stolenItemName}.
```

`INICIAR INVESTIGAÇÃO` conduz à cidade inicial na segunda-feira às 09:00.

## 8. Cidade e investigação

### 8.1 Chegada

A cidade, dia e hora aparecem à esquerda. A fotografia da cidade ocupa o painel visual. À direita, o painel apresenta uma introdução curta e algumas curiosidades locais derivadas do conteúdo canônico da cidade. Nenhum texto declara se a cidade está certa ou errada.

### 8.2 Buscar

O botão de lupa `BUSCAR` mostra exatamente três locais. Um local visitado recebe o marcador `VISITADO`; pode ser reaberto sem custo para reler o depoimento.

Ao investigar um local novo:

1. os controles travam;
2. a miniatura do local e uma trilha curta de pegadas confirmam o deslocamento;
3. o relógio avança;
4. o prazo é verificado;
5. cenário e testemunha aparecem;
6. o depoimento é revelado com efeito de terminal.

O primeiro clique/Enter durante a digitação apenas completa o texto. Um segundo avança.

### 8.3 Pista viva

Ao chegar corretamente a uma nova etapa, uma presença da **T.C.C.** pode cruzar a tela. O texto-base é:

> UM OLHEIRO DA T.C.C. SUMIU ENTRE OS PRÉDIOS.

Essa cena confirma perseguição ativa sem revelar o próximo destino.

Quando a apresentação de proximidade ocorre novamente na mesma etapa, o mesmo capanga atravessa um parapeito na ponta dos pés, de braços abertos para se equilibrar. A corrida é sempre a primeira variante e o movimento furtivo é a segunda; ambas acontecem antes do depoimento e não alteram pista, rota ou relógio.

### 8.4 Pista fria

Em uma cidade errada, testemunhas respondem com variações equivalentes a:

- `Ninguém com essa descrição passou por aqui.`
- `A T.C.C. não deixou sinal nesta cidade.`
- `Essa pista esfriou. Eu revisaria o último paradeiro confirmado.`

Não há pistas falsas nem nova evidência de identidade.

## 9. Viagem

`VER` exibe somente uma lista textual das cidades candidatas. Essa lista é informativa: nenhuma cidade pode ser selecionada e nenhuma viagem parte dessa tela.

`PARTIR` abre o mapa e os mesmos destinos candidatos como opções selecionáveis. Nenhum recebe marca de recomendação.

Após a escolha:

1. o destino é confirmado;
2. o avião atravessa o mapa em poucos quadros;
3. o relógio avança pelo custo da conexão;
4. o prazo é verificado;
5. a nova cidade aparece.

## 10. Arquivos

O menu superior `DOSSIÊS` abre os dez dossiês da T.C.C. Cada dossiê mostra retrato, nome, ocupação ficcional e os cinco traços usados pelo mandado. Consultar arquivos não consome tempo.

As biografias são curtas e não acrescentam relações ou fatos de vida da Deolane além do que for definido em conteúdo aprovado.

## 11. Mandado

O quarto botão, representado por um computador e rotulado `P.C`, abre o computador de mandados da Agência Federal. Os campos são sexo, cabelo, hobby, característica e veículo.

Antes de confirmar:

```text
CALCULAR MANDADO
CUSTO OPERACIONAL: 2 HORAS
```

Resultados:

- zero correspondências: `NENHUM SUSPEITO CORRESPONDE. MANDADO CANCELADO.`;
- múltiplas: `IDENTIFICAÇÃO INSUFICIENTE.` seguida dos nomes;
- uma: `MANDADO EMITIDO: {suspectName}.`.

O computador compara apenas os dados digitados. Ele não corrige um mandado único, porém errado.

## 12. Cidade final

A cidade final não é rotulada. Depoimentos e cenas indicam que a T.C.C. está próxima. Existem três locais, e um é o esconderijo estável.

Locais incorretos usam variações de:

> Você chegou perto. Há sinais de que o suspeito ainda está nesta cidade.

Ao abrir o esconderijo, o tempo avança e a resolução torna-se definitiva.

## 13. Captura

Com tempo restante e mandado correto:

1. o culpado disfarçado cruza a cena correndo;
2. três agentes federais correm atrás dele;
3. um agente conduz o preso da direita para a esquerda, com as mãos levantadas;
4. a Agência Federal confirma a prisão;
5. o objeto roubado é recuperado;
6. surge `CASO RESOLVIDO`.

Resumo:

```text
PRESO: {culpritName}
RECUPERADO: {stolenItemName}
TEMPO DECORRIDO: {elapsedHours} HORAS
CASOS RESOLVIDOS: {solvedCases}
```

## 14. Fuga e falha

### Sem mandado

> VOCÊ ENCONTROU O CULPADO, MAS NÃO TROUXE UM MANDADO. A T.C.C. ESCAPOU PELA BUROCRACIA.

### Mandado errado

> O MANDADO NOMEAVA {warrantName}. O CULPADO ERA {culpritName}. A T.C.C. DESAPARECEU.

### Prazo esgotado

> SÁBADO, 09:00. A ROTA ESFRIOU. O CULPADO CRUZOU A FRONTEIRA.

### Abandono

> CASO ENCERRADO A PEDIDO DO DETETIVE.

Toda falha retorna à Agência Federal, preserva o posto e permite outro caso.

## 15. Promoção

Quando um limiar é alcançado, após o resumo do caso:

```text
ARQUIVO ATUALIZADO.
NOVO POSTO: {rankName}
```

Um distintivo aparece. Não há prova de promoção na primeira versão.

## 16. Caso Deolane

Após 13 casos resolvidos, o boletim muda:

```text
ALERTA MÁXIMO
A CHEFE DA T.C.C. ESTÁ EM MOVIMENTO.
ALVO: DEOLANE SAN PAOLO
```

O nome conhecido não elimina a investigação de identidade: as pistas ainda precisam formar uma combinação única, e o jogador ainda deve emitir o mandado para Deolane. A rota tem oito cidades e o prazo permanece em 120 horas.

## 17. Final

Após capturar Deolane com mandado correto:

```text
DEOLANE SAN PAOLO FOI CAPTURADA.
A TRÍADE CHAPA-COCO PERDEU SUA CHEFE.
O OBJETO FOI RECUPERADO.
```

Segue o Hall da Fama:

```text
AGÊNCIA FEDERAL — HALL DA FAMA
DETETIVE: {playerName}
POSTO: DETETIVE ÁS
CASOS RESOLVIDOS: 14
```

O perfil permanece salvo e o Hall da Fama pode ser revisto pelo menu. O primeiro lançamento encerra o arco principal aqui; não inventa pós-carreira.

## 18. Sequência completa

```text
BOOT → TÍTULO → AGÊNCIA FEDERAL → NOME → BUSCA DE REGISTRO
→ PLANTÃO → DESIGNAÇÃO → CIDADE → INVESTIGAÇÃO/VIAGEM/ARQUIVOS/MANDADO
→ ESCONDERIJO → CAPTURA OU FUGA → RELATÓRIO → PROMOÇÃO/AGÊNCIA
→ CASOS SUBSEQUENTES → CASO DEOLANE → HALL DA FAMA
```
