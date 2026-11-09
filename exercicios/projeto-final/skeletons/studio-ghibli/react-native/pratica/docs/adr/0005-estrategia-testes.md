# ADR 0005 — Estratégia de testes: Vitest e Maestro

- **Status:** aceito
- **Data:** 2026-11-07

## Contexto
Testes automáticos são programas que verificam se o app se comporta como esperado. Eles aparecem nas duas rubricas:

- A Aula 5 pede pelo menos 3 testes próprios.
- A Aula 6 dá 15 pontos para 5 fluxos completos no Maestro, rodando no CI (o processo automático que executa os testes a cada envio de código), e 5 pontos para a convenção de `testID`, as etiquetas invisíveis que permitem aos testes achar cada elemento da tela. Essas notas são automáticas.

O grupo também já tem preferência pelo Vitest.

## Decisão
Usar uma ferramenta para cada nível de teste:

| Nível | Ferramenta | O que verifica |
|---|---|---|
| Regras de negócio (TypeScript puro) | **Vitest** | As regras do app, como filtrar e favoritar, em `src/domain/**` e `src/data/mappers.ts`. Esse código não depende do React Native |
| Ponta a ponta no celular | **Maestro** | Age como um usuário no app instalado, tocando e digitando. Há 1 fluxo por spec, em `e2e/maestro/`, rodando no CI |

## Alternativas descartadas

### Playwright
Ferramenta que controla um navegador para testar sites de ponta a ponta. Poderia substituir o Maestro ou ser usado junto com ele, testando a versão web do app. Os mesmos `testID` funcionariam nos dois casos, porque na web o react-native-web os transforma em `data-testid`.

**Vantagens**
- Os testes são rápidos, estáveis e não precisam de emulador.
- Tem ótimas ferramentas para investigar falhas, como gravação da execução passo a passo.
- O grupo já tem familiaridade com ele.

**Desvantagens**
- Testa apenas a versão web, então não vê o app instalado no celular, com seus gestos, efeito de vidro e armazenamento nativo.
- Junto com o Maestro, teríamos cada cenário escrito e mantido duas vezes.
- Exigiria manter a versão web funcionando como um produto, sendo que a entrega é um app mobile.

**Por que não:** a disciplina avalia o app no celular com o Maestro, e os slides não pedem testes na web. Usar só o Playwright colocaria em risco até 20 pontos da rubrica (15 dos fluxos e 5 dos `testID`). Usar os dois duplicaria o trabalho sem acrescentar nota nem cobrir o que o Maestro já verifica.

### Jest com `jest-expo`
O Jest é a ferramenta de testes mais usada com Expo e o `jest-expo` é a configuração pronta para esse caso. Junto com a React Native Testing Library, ele permite testar componentes isolados, como verificar se um botão mostra o texto certo ou reage ao toque. O teste não abre um celular de verdade: a parte nativa é simulada.

**Vantagens**
- É o caminho indicado na documentação do Expo para testar componentes, algo que o Vitest não cobre bem.
- Os testes de componente rodam bem mais rápido que os de ponta a ponta.

**Desvantagens**
- Passaríamos a manter dois sistemas de testes unitários, ou teríamos que trocar o Vitest por ele.
- Como a parte nativa é simulada, o teste não mostra como o componente se comporta no aparelho.

**Por que não:** nossos componentes são principalmente visuais e o comportamento deles já é verificado pelo Maestro, no aparelho. Se surgirem componentes com lógica própria que justifiquem testes isolados, este é o caminho a adotar.

### Vitest também para os componentes de tela
Assim, botões e cartões teriam testes unitários com a mesma ferramenta das regras.

**Por que não:** o suporte do Vitest a componentes do React Native ainda é recente e menos previsível que o `jest-expo`. Mantemos o Vitest no que ele faz bem: testar regras em TypeScript puro.

### Detox
Ferramenta de testes de ponta a ponta para React Native, concorrente direta do Maestro.

**Por que não:** a preparação é mais pesada, porque ela precisa ser integrada aos projetos nativos Android e iOS. O Maestro usa arquivos de texto simples, e é ele que a disciplina avalia.

## Consequências
- ✅ Fica valendo uma regra de arquitetura: **a pasta `domain` não usa React nem React Native**. Se usar, os testes unitários deixam de funcionar, então o problema aparece logo.
- ⚠️ Os componentes de tela não têm testes unitários próprios. Eles são verificados apenas pelos fluxos de ponta a ponta.
