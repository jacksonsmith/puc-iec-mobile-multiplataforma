# ADR 0002 — NativeWind (Tailwind) para estilização

- **Status:** aceito
- **Data:** 2026-11-07

## Contexto
A interface vale 8 pontos, avaliados como "agradável e consistente". O professor recomenda definir o visual num lugar só e oferecer tema claro e escuro.

A questão é de arquitetura: onde ficam as regras visuais do app e o que impede cada tela de inventar as suas.

## Decisão
Usar **NativeWind**, que leva para o React Native o Tailwind, uma forma popular de estilizar telas usando nomes curtos direto no componente. Por exemplo, `bg-canvas` aplica a cor de fundo e `text-ink` aplica a cor do texto.

Dois motivos sustentam a escolha:

1. **Toda a camada de estilos é definida em um arquivo só.** Cores, espaçamentos, raios e fontes ficam no `tailwind.config`, como *tokens*: nomes que representam um valor de design. Para mudar o visual do app, mudamos esse arquivo.
2. **Escrevemos bem menos código.** O estilo fica na própria linha do componente, sem criar um objeto de estilo ou um componente estilizado para cada elemento.

Cada token de cor tem dois valores, um para o tema Noite (escuro) e outro para o tema Dia (claro), e o app escolhe qual usar conforme a preferência do celular. Assim, os componentes só citam o nome do token e não usam o prefixo `dark:`, a forma do Tailwind de indicar uma cor só para o modo escuro. Tecnicamente, cada token é uma variável CSS.

### Como isso funciona no celular
O celular não tem navegador, então não existe CSS de verdade nas telas nativas. Na web, o Tailwind gera um arquivo CSS comum antes de o site ir ao ar. No celular, o NativeWind faz a maior parte do trabalho na hora de gerar o app, convertendo as classes em objetos de estilo do React Native. Uma pequena parte fica para o app em funcionamento, como escolher o valor certo conforme o tema ou o estado de um botão pressionado.

## Alternativas descartadas

### styled-components
Biblioteca em que cada elemento visual é criado como um componente com CSS escrito dentro dele. No React Native, é usada pelo pacote `styled-components/native`.

**Vantagens**
- A escrita é CSS tradicional, conhecida por quem vem da web.
- O estilo pode mudar facilmente conforme as propriedades do componente.
- Tem suporte a tema compartilhado.

**Desvantagens**
- Cada elemento estilizado precisa de um nome e de uma definição própria, o que deixa o código mais longo.
- As regras visuais ficam espalhadas pelos arquivos de cada componente.
- O CSS é interpretado com o app em funcionamento, o que traz um custo que uma lista longa de pôsteres pode sentir.

**Por que não:** queremos o contrário do que ela propõe. Nossa decisão é concentrar as regras num arquivo só e escrever menos, e o styled-components distribui os estilos por componente.

### `StyleSheet` puro com um arquivo `theme.ts`
`StyleSheet` é a forma de estilizar que já vem no React Native. As cores ficariam reunidas em um arquivo `theme.ts`.

**Vantagens**
- Não exige nenhuma biblioteca, e é o caminho mais direto e previsível.

**Desvantagens**
- Exige um objeto de estilo em cada arquivo, com mais código.
- Nada impede alguém de escrever uma cor direto no componente. Quando isso acontece, aquela parte da tela deixa de acompanhar a troca entre claro e escuro.

**Por que não:** o tema ficaria num lugar só, mas o uso dele continuaria verboso e sem uma barreira contra cores fora do padrão.

### React Native Paper
Biblioteca de componentes prontos (botões, cartões, campos) que seguem o Material Design, o padrão visual do Google. É uma das recomendações opcionais da Aula 5. Ela tem um sistema de tema próprio e não usa styled-components.

**Vantagens**
- É o caminho mais rápido para ter telas organizadas e acessíveis.

**Desvantagens**
- O resultado tende a parecer um app Android padrão.

**Por que não:** nossa identidade tem vidro fosco e fileiras de pôsteres, ao estilo de um app de streaming. Teríamos que personalizar quase todos os componentes, perdendo a vantagem de usá-los prontos.

### Tamagui
Ferramenta completa de estilos e componentes, com recursos avançados de tema e de desempenho.

**Vantagens**
- Reúne estilo, tema e componentes, e funciona bem em celular e web.

**Desvantagens**
- A instalação é mais complexa e o grupo teria que aprender um sistema próprio.

**Por que não:** oferece muito mais do que usaríamos. O NativeWind resolve o que precisamos com um modelo mais simples.

## Consequências
- ✅ Para trocar de tema, mudam apenas os valores dos tokens; nenhum componente precisa ser alterado.
- ⚠️ As listas de classes podem ficar longas em componentes com muitos estilos. Quando se repetirem, viram um componente reutilizável.
- ⚠️ O Tailwind no celular não é idêntico ao da web. Por exemplo, o padrão de `flex` é diferente. Também definimos `inlineRem: 16` no `metro.config.js`, porque no celular o `rem` valeria 14 e `p-4` não daria os 16px do token `space-4`.
- ⚠️ Três tokens usados por cima das imagens dos filmes (`glass-scrim`, `ink-on-image` e `lamp-on-image`) têm o mesmo valor nos dois temas, de propósito: a imagem não muda com o tema, então o que fica sobre ela também não deve mudar.
- ⚠️ As versões do NativeWind, do Tailwind e do Expo precisam ser compatíveis entre si. Na instalação, devemos seguir a documentação oficial.
