# PDR 0003 — Identidade visual: Kodama

- **Status:** aceito
- **Data:** 2026-11-07
- **Brandbook:** https://claude.ai/artifact/BaAvPBXkLhDhTZQu6U9Yjs (fonte da verdade)
- **Tokens:** [`docs/brand-tokens.json`](../brand-tokens.json) · **Marca:** [`assets/brand/`](../../assets/brand/)

## Contexto
UI/UX vale 8 pts. O professor sugere: tema num lugar só, claro/escuro, skeleton, placeholder de imagem, ícone e splash próprios, 3 screenshots no README.

## Decisão de produto (v3)
- **Nome:** Kodama (木霊), o espírito das árvores do folclore japonês. Catálogo de fã com cara de app de streaming. App de fã, não oficial.
- **Símbolo (v3):** abstração geométrica do rosto do kodama: cabeça clara arredondada, inclinada 9°, com dois olhos e boca vazados. Ícone com um segundo kodama espiando no canto. Arquivos em [`assets/brand/`](../../assets/brand/).
- **Temas:** dois, **Noite** (escuro, a sala de cinema; é a referência) e **Dia** (claro, papel washi e céu de tarde). O app segue o tema do sistema (`userInterfaceStyle: "automatic"`). Muda fundo, texto e vidro; não mudam layout, tipografia, imagens e o vidro sobre imagem.
- **A imagem do filme é a protagonista nos dois temas:** pôster 2:3 de borda a borda na lista, banner 16:9 de borda a borda no topo do detalhe. A imagem nunca é tingida pelo tema; o degradê para `canvas` cobre só a metade de baixo do banner.
- **Vidro (glassmorphism):** controles de vidro fosco (`glass`, `glass-strong`, borda `glass-line`, blur) sobre um brilho ambiente (`glow-sky`, `glow-lamp`). No Noite, branco translúcido com aresta de luz; no Dia, branco leitoso com aresta escura. Sobre imagem, sempre o véu escuro `glass-scrim` (72%) com `ink-on-image` / `lamp-on-image`, iguais nos dois temas. iOS 26+: `expo-glass-effect`; demais: `expo-blur` (`tint` dark/light conforme o tema); sem blur: `canvas-raised` opaco.
- **Paleta (tokens por papel, com valor nos dois temas):** `canvas` (fundo), `ink` / `ink-muted` (texto), `sky` (marca e ação), `lamp` (só favoritos), `meadow` (nota ≥ 90), `danger` (erro). No Dia, `sky` e `lamp` são mais escuros para passar em AA. Todo texto ≥ 4.5:1 nos dois temas.
- **Tipografia:** **Shippori Mincho B1** para todos os títulos (fileiras, nome do filme, detalhe) e **Zen Kaku Gothic New** para todo o texto. Ambas têm japonês.
- **Layout:** fileiras horizontais com título (ver PDR 0004).
- **Voz:** pt-BR, "você", caixa de frase, sem exclamação, sem emoji.

## Alternativas descartadas
- **v2 com um tema só (Noite):** coerente com a sala de cinema, mas ignora a preferência do sistema do usuário e a dica do professor (tema claro e escuro). Revertida na v3.
- **v1 com temas Dia e Noite e duas fontes da mesma família:** pouca distinção entre título e texto, e o tema claro tingia e apagava os pôsteres. A v3 resolve isso: a imagem e o vidro sobre ela não mudam com o tema.
- **Nome Kaze (v1/v2) com símbolo de vento:** genérico; o kodama liga a marca ao universo dos filmes e à ideia de um companheiro discreto.
- **Copiar o desenho do kodama do filme ou usar arte/logo do Studio Ghibli:** direito autoral e parecer app oficial. O símbolo é uma abstração própria (círculos e uma forma arredondada).
- **Material/Paper padrão:** visual genérico, perde pontos de UI/UX.

## Restrições
- Nenhum hex fora dos tokens no código.
- Testar cada tela nos dois temas (critério do DoD em `CONTRIBUTING.md`).
- Testar com fonte do sistema aumentada e em paisagem.

## Risco
O símbolo lembra o kodama de *Princesa Mononoke*. A animação de entrada do símbolo também se inspira no gesto dos kodamas do filme, o que aumenta a semelhança. Para o projeto acadêmico de fã é adequado; para publicar em loja, a semelhança precisaria de avaliação jurídica.
