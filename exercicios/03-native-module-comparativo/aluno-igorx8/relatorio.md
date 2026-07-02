# Relatorio comparativo: React Native, Flutter, KMP e nativo

## Contexto

O modulo proposto neste exercicio expoe uma API simples chamada `NativeDeviceIntegrity`.
Ela consulta dados basicos do dispositivo, versao do sistema operacional e indicios
de execucao em emulador/simulador. O caso e propositalmente pequeno, mas representa
uma necessidade recorrente em aplicativos moveis reais: acessar capacidades de
plataforma que nao estao completas ou padronizadas no nivel JavaScript.

Essa necessidade evidencia as diferencas entre React Native, Flutter, Kotlin
Multiplatform e desenvolvimento nativo. A escolha arquitetural nao deve considerar
apenas produtividade de UI, mas tambem custo de integracao nativa, governanca de
codigo por plataforma, desempenho, contratacao, testabilidade e ciclo de release.

## React Native

React Native e adequado quando o produto precisa compartilhar boa parte da UI e da
logica de apresentacao, mas ainda manter acesso direto aos SDKs nativos. A New
Architecture melhora a fronteira entre JavaScript e nativo com JSI, TurboModules,
Fabric e Codegen. No modelo usado neste exercicio, o contrato TypeScript em
`specs/NativeDeviceIntegrity.ts` e a fonte da verdade para a API consumida pelo app.
As implementacoes Kotlin e Swift ficam responsaveis pelos detalhes especificos de
Android e iOS.

O ponto forte e a combinacao entre velocidade de desenvolvimento e integracao com
ecossistema web/TypeScript. Times que ja dominam React conseguem construir telas,
estado local, acesso HTTP e navegacao com uma curva relativamente baixa. Para
features que exigem SDK nativo, o TurboModule permite expor uma API tipada sem cair
no modelo antigo de bridge serializada.

O custo aparece quando o projeto depende de muitas bibliotecas nativas, upgrades de
React Native ou ajustes finos por plataforma. A equipe precisa entender Metro,
Gradle, CocoaPods, Xcode, Android Studio e a propria arquitetura RN. Portanto, RN
funciona melhor quando ha disciplina para isolar integracoes nativas, manter specs
pequenas e automatizar CI para Android e iOS.

## Flutter

Flutter usa Dart e renderizacao propria via engine. Isso cria uma experiencia visual
muito consistente entre plataformas, com alto controle sobre UI, animacoes e layout.
Para produtos em que a identidade visual e muito customizada, Flutter tende a reduzir
divergencias entre Android e iOS, porque grande parte da renderizacao nao depende dos
componentes nativos padrao.

O acesso nativo em Flutter normalmente usa Platform Channels ou plugins. O modelo e
maduro, mas adiciona uma camada de mensagens entre Dart e Kotlin/Swift. Em casos
simples, como consultar nome do dispositivo ou estado do emulador, a implementacao e
direta. Em casos com alto volume de chamadas, streaming ou tipos complexos, e preciso
desenhar bem o contrato para evitar gargalos e acoplamento.

Comparado ao React Native, Flutter oferece previsibilidade visual maior, mas exige
adocao de Dart e de um ecossistema especifico. Em organizacoes com forte base web
React, RN pode ser mais natural. Em organizacoes que querem um stack de UI movel
mais fechado e consistente, Flutter pode ser mais simples de padronizar.

## Kotlin Multiplatform

Kotlin Multiplatform (KMP) foca compartilhamento de logica, nao necessariamente de
UI. O codigo comum pode conter regras de negocio, networking, serializacao, cache e
validacoes, enquanto Android e iOS mantem interfaces nativas. Essa abordagem e forte
quando a experiencia de usuario deve seguir rigorosamente as convencoes de cada
plataforma, mas a regra de dominio precisa ser unica.

No caso de um modulo como `NativeDeviceIntegrity`, KMP poderia modelar uma interface
com `expect/actual`: o modulo comum define o contrato e cada plataforma fornece sua
implementacao. A vantagem e manter a logica em Kotlin com integracao natural ao
Android. O desafio maior costuma estar no lado iOS, onde a equipe precisa consumir
artefatos Kotlin/Native em Swift e lidar com detalhes de interoperabilidade.

KMP e uma excelente escolha para empresas que ja possuem forte investimento em
Kotlin, backend JVM ou Android nativo. Entretanto, ele nao elimina o custo de manter
duas UIs quando o produto exige velocidade visual multiplataforma. A decisao costuma
ser favoravel quando consistencia de regra e qualidade nativa sao mais importantes
que compartilhamento completo de tela.

## Nativo Android e iOS

Desenvolvimento nativo puro oferece o maior controle sobre desempenho, APIs de
plataforma, acessibilidade, ferramentas oficiais e comportamento de sistema. Para
aplicativos com uso intenso de camera, sensores, pagamentos, biometria, Bluetooth,
background tasks, widgets ou requisitos rigorosos de UX por plataforma, o nativo
reduz camadas intermediarias e facilita diagnostico.

O custo e duplicacao. Android e iOS exigem stacks, especialistas, pipelines e
planejamento de release separados. A mesma regra de negocio pode acabar implementada
duas vezes, aumentando risco de divergencia. Esse custo pode ser aceitavel em
produtos de alta escala, times grandes ou dominios em que experiencia nativa e
diferencial competitivo.

No exemplo deste exercicio, a parte nativa e pequena. Fazer todo o aplicativo em
nativo apenas por causa dessa API seria excessivo. O melhor desenho e expor a
capacidade nativa por um modulo pequeno e manter a maior parte do produto em uma
camada compartilhada quando os requisitos permitirem.

## Comparativo sintetico

| Criterio | React Native | Flutter | KMP | Nativo |
|---|---|---|---|---|
| Compartilhamento de UI | Alto | Alto | Baixo ou opcional | Nenhum |
| Compartilhamento de regra | Medio/alto | Medio/alto | Alto | Baixo |
| Acesso a SDK nativo | Bom via TurboModules | Bom via plugins/channels | Excelente no Android, bom no iOS | Excelente |
| Consistencia visual | Boa, com ajustes | Muito alta | Depende da UI nativa | Especifica por plataforma |
| Curva para times web | Baixa/media | Media | Alta | Alta |
| Risco em upgrades | Medio | Medio | Medio | Baixo/medio por plataforma |
| Melhor uso | Apps multiplataforma com equipe React | UI consistente e customizada | Regra compartilhada com UI nativa | Controle maximo por plataforma |

## Decisao recomendada

Para um aplicativo corporativo comum, com telas transacionais, integracoes HTTP,
estado local e algumas capacidades nativas pontuais, React Native com New
Architecture e uma escolha equilibrada. Ele permite compartilhar UI e experiencia de
desenvolvimento, enquanto TurboModules mantem uma saida limpa para recursos nativos.

Flutter seria preferivel se o produto exigisse identidade visual altamente custom e
uma equipe disposta a padronizar em Dart. KMP seria preferivel se o objetivo central
fosse compartilhar regras de dominio mantendo UIs nativas. Desenvolvimento nativo
seria a melhor escolha quando desempenho, integracao profunda com sistema ou
experiencia especifica por plataforma fossem mais importantes que velocidade de
entrega multiplataforma.

Assim, a arquitetura recomendada para o cenario deste exercicio e React Native com
TurboModules pequenos, tipados e orientados a contratos. O modulo nativo deve expor
apenas capacidades que realmente precisam sair do JavaScript, mantendo a API simples,
testavel e estavel para evolucao do aplicativo.
