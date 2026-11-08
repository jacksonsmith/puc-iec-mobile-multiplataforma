# ADR 0001 — Expo + React Native como framework

- **Status:** aceito
- **Data:** 2026-11-07

## Contexto
O projeto final pode ser feito em Flutter, React Native ou Kotlin Multiplatform (KMP). As três são formas de criar um app para Android e iOS escrevendo o código uma vez só.

O Kodama é um catálogo com fileiras de pôsteres e controles de vidro fosco. Precisamos de uma base que funcione bem com esse visual, rode também na web e permita testar o app automaticamente, simulando o uso de uma pessoa.

## Decisão
Usar **React Native** com **Expo**.

- **React Native** permite escrever o app em TypeScript e React e mostra na tela os componentes reais de cada sistema.
- **Expo** é um conjunto de ferramentas em volta do React Native. Ele cuida da parte mais trabalhosa: preparar o projeto, dar acesso a recursos do celular e gerar o app para instalar.
- **Expo Router** organiza a navegação: cada arquivo dentro de `src/app/` vira uma tela.

Versões: Expo SDK 58 e React Native 0.88, com a New Architecture, que é a forma atual de o código TypeScript se comunicar com o celular.

### Por que essa combinação
1. **Conhecimento do grupo.** O grupo já trabalha com TypeScript e React, então o raciocínio de montar telas com componentes e estado é o mesmo.
2. **Componentes reais do sistema.** Como o React Native usa os componentes de cada plataforma, o app pode usar o efeito de vidro nativo do iOS 26 (`expo-glass-effect`), que é central na nossa identidade visual (PDR 0003).
3. **Testes no app real e web de brinde.** O Maestro encontra os elementos da tela pelas etiquetas `testID` que o React Native já oferece (ADR 0005). Além disso, o mesmo código gera uma versão web, sem trabalho extra.
4. **Bibliotecas do ecossistema React.** Ferramentas como TanStack Query e Zustand (ADR 0004) funcionam aqui do mesmo jeito que em um site React.
5. **Menos manutenção da parte nativa.** O Expo gera os projetos de Android e iOS a partir de um arquivo de configuração, o que evita manter essa parte à mão.
6. **Correções sem nova publicação.** Se o app for publicado, o EAS Update permite enviar correções de código direto aos aparelhos, sem passar por uma nova versão na loja.

## Alternativas descartadas

### Flutter
Framework do Google em que o app é escrito na linguagem Dart e o próprio Flutter desenha cada elemento da tela.

**Vantagens**
- O visual fica igual em todos os aparelhos, porque o desenho não depende do sistema.
- Tem bom desempenho em animações e uma coleção grande de componentes prontos.

**Desvantagens**
- Usa Dart, uma linguagem que o grupo não conhece e que não aproveita o que já sabemos de React.
- Como desenha tudo sozinho, imita os componentes do sistema. Um visual novo, como o vidro do iOS 26, precisa ser recriado.
- Na web, a tela também é desenhada como uma imagem única (*canvas*), o que torna mais difícil dar suporte a leitores de tela.
- Não tem um serviço oficial para enviar correções sem passar pela loja.

**Por que não:** a principal vantagem, o visual idêntico em todo aparelho, importa menos para nós do que usar o vidro real do sistema e aproveitar o conhecimento do grupo.

### Kotlin Multiplatform (KMP) com Compose
Permite escrever a lógica do app, e também as telas, em Kotlin, e usar esse código no Android e no iOS.

**Vantagens**
- É forte para compartilhar regras de negócio complexas entre plataformas.
- Se faltar o código específico de uma plataforma, o projeto nem compila, o que evita erros na mão do usuário (Aula 5).
- O código roda de forma nativa e cada plataforma pode manter telas próprias, se o time quiser.

**Desvantagens**
- Exige aprender Kotlin e Compose.
- O ambiente é sensível: Android Studio, Gradle e Kotlin precisam estar em versões compatíveis, e a primeira preparação baixa vários gigabytes.
- Segundo a Aula 5, a interface compartilhada ainda está amadurecendo no iOS e a web é experimental.
- O conjunto de bibliotecas prontas é menor que o do React Native.

**Por que não:** o ponto forte do KMP é compartilhar regras complexas, e as nossas são simples (buscar, filtrar, favoritar). Pagaríamos o custo do ambiente sem usar o principal benefício.

### React Native sem Expo
É usar o React Native sozinho. A linguagem e o jeito de escrever as telas seriam os mesmos da nossa escolha. A diferença é tudo o que fica em volta do código.

**Vantagens**
- Dá controle total sobre as pastas `ios/` e `android/`, que são os projetos nativos do app.
- Não depende das decisões nem dos serviços do Expo.

**Desvantagens**
- Muitas bibliotecas que usam recursos do celular pedem ajustes manuais nessas duas pastas.
- Cada computador precisa ter o ambiente completo instalado, e gerar a versão de iOS exige um Mac com Xcode.
- Atualizar a versão do React Native costuma exigir mudanças manuais nesses arquivos.

**Por que não:** não precisamos desse controle extra. O Expo gera as duas pastas a partir do `app.json` (recurso chamado de Continuous Native Generation), o serviço EAS pode gerar o app na nuvem, e bibliotecas como `expo-image` (imagens) e `expo-haptics` (vibração) já vêm prontas para funcionar juntas.

## Consequências
- ✅ O mesmo código funciona em Android, iOS e web.
- ✅ O Maestro encontra os elementos da tela pelo `testID`, uma etiqueta invisível que o React Native já oferece.
- ⚠️ O código TypeScript roda ao lado da parte nativa, o que pode pesar em telas com gráficos muito intensos. Não é o caso de um catálogo, mas listas longas pedem cuidado.
- ⚠️ As bibliotecas precisam ser compatíveis com a versão do Expo. Por isso, instalamos sempre com `npx expo install`.
- ⚠️ O Expo Go, app usado para abrir o projeto rapidamente no celular, só inclui um conjunto fixo de recursos nativos. Se adicionarmos uma biblioteca nativa fora desse conjunto, precisaremos gerar uma versão própria de desenvolvimento do app (*development build*).
