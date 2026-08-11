# Deolane San Paolo

Jogo de investigação geográfica para navegador, construído do zero com a estrutura mecânica e a linguagem visual dos jogos DOS de investigação do fim dos anos 1980 e início dos 1990.

Você entra para a Agência Atlas, segue pistas por 30 cidades, identifica um dos dez suspeitos, emite um mandado válido e tenta deter a **T.C.C. — Tríade Chapa-Coco** antes do prazo de 120 horas. O décimo quarto caso leva ao confronto final com Deolane San Paolo.

## Jogar

Produção: <https://mreaggle.github.io/DeolaneSanPaolo/>

- No PC, a superfície lógica de 640×400 é ampliada como uma única tela para 1280×800 ou mais quando há espaço.
- No celular, jogue em paisagem; a composição original é ajustada ao visor sem reordenar os painéis.
- Use **TELA CHEIA** no título ou `F11` durante uma investigação.
- Atalhos: `S`/`1` locais, `D`/`2` viagem, `R`/`3` mandado, `F`/`4` dossiês.

## Desenvolvimento

```bash
npm install
npm run dev
npm test
npm run build
```

Stack: TypeScript, Svelte 5, Vite e CSS. O motor não depende do DOM; geração de casos, rota, pistas, mandado, relógio e progressão vivem em módulos testáveis. O save é versionado e fica apenas no `localStorage`.

## Arte

As 158 artes do manifesto são arquivos locais gerados em desenvolvimento com `gpt-image-2`, usando referências DOS para gramática de pixels, paleta, contorno e dithering — nunca para copiar personagens ou telas. O navegador não contém token nem faz chamadas de IA.

Comandos explícitos:

```bash
npm run assets:prepare -- --category city-scene --max-assets 2
npm run assets:generate -- --only city-rio-de-janeiro
npm run assets:validate
```

O gerador aceita `--dry-run`, `--run`, `--only`, `--category`, `--max-assets`, `--force`, `--skip-existing` e `--concurrency`. Metadados e hashes ficam em `assets-meta/`; saídas brutas ficam em `.cache/generated-assets/` e não são publicadas.

## Pesquisa e independência

O projeto consulta capturas, manual e reconstruções apenas como evidência comparativa. Decisões confirmadas e limitações da pesquisa estão registradas em [ORIGINAL_GAME_ANALYSIS.md](ORIGINAL_GAME_ANALYSIS.md). Ficção, personagens, T.C.C., Agência Atlas, textos, código e artes finais são originais deste projeto.

A interface usa localmente a fonte bitmap **Silkscreen**, distribuída sob a SIL Open Font License 1.1; a licença acompanha o jogo em `public/fonts/OFL.txt`. Nenhuma fonte é carregada de um serviço externo durante o jogo.
