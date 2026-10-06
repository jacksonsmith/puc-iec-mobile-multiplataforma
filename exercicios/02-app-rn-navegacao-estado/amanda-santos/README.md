# Atividade 2 — Amanda Santos Pereira Bouzan

## Identificação
- Aluna: Amanda Santos Pereira Bouzan
- Opção Reanimated: A — Heart pop (escala com spring e rotação)
- Base: starter do professor Jackson Smith, Atividade 2.
- Fork: preencher depois do envio pela aluna.

## Como rodar
Requer Node.js 22. Dentro desta pasta:

```bash
npm ci
cp .env.example .env
npm run online
```
Abra a porta 8080. O comando gera a versão web e serve os arquivos; depois de alterar o código ou o `.env`, pare com Ctrl+C e rode novamente.

O modo demonstração usa filmes fictícios para testar sem cadastro na TMDB. Para consultar a API real, altere `.env`:

```env
EXPO_PUBLIC_DEMO_MODE=false
EXPO_PUBLIC_TMDB_TOKEN=seu_token_de_leitura_da_TMDB
```

Não envie `.env` ao GitHub. Variáveis EXPO_PUBLIC ficam visíveis no aplicativo; use apenas credencial de leitura da TMDB.

## Testar online no tablet — GitHub Codespaces
1. Extraia o ZIP. Os arquivos já estão organizados no caminho solicitado pelo professor.
2. No seu fork, faça upload da pasta `exercicios/02-app-rn-navegacao-estado/amanda-santos`. Esse envio será feito por você; nenhum commit foi feito pelo assistente.
3. No GitHub, abra **Code > Codespaces > Create codespace on main** (ou escolha sua branch de entrega). Use Chrome em modo site para computador se necessário.
4. No terminal do Codespaces:

```bash
cd exercicios/02-app-rn-navegacao-estado/amanda-santos
npm ci
cp .env.example .env
npm run online
```

5. Na aba **Ports**, abra a porta **8080** pelo ícone de navegador. Mantenha a porta privada.
6. Marque corações; abra um detalhe; volte; recarregue a página e confirme que os favoritos continuam salvos. Teste o filtro e limpar favoritos.
7. Para rodar os testes: abra outro terminal na mesma pasta e execute `npm test -- --runInBand`.
8. Ao terminar, pare o Codespace. A disponibilidade de horas depende da sua conta GitHub.

Também é possível usar um ambiente online Node.js que aceite upload de projeto e exposição de portas. O Codespaces facilita preservar a estrutura original do trabalho.

## Android/iOS — validação nativa
No navegador, a persistência usa **localStorage** e a animação roda no ambiente web. Isso não comprova MMKV nativo nem execução da animação na UI thread de Android/iOS.
O código nativo usa **MMKV v3**, que requer uma build de desenvolvimento; Expo Go não contém esse módulo.
Em um computador com Android SDK, execute:

```bash
npx expo run:android
```

Para iOS, em macOS com Xcode: `npx expo run:ios`.
É necessário testar no dispositivo/build nativa antes de afirmar que MMKV e a animação nativa foram verificados. O projeto mantém a nova arquitetura e Hermes habilitados.

## O que o app faz
Lista filmes populares por TanStack Query, abre o detalhe e permite favoritar na lista ou no detalhe. Zustand gerencia contador e favoritos, sem duplicar IDs. Os favoritos são salvos após mudanças e restaurados na inicialização. O coração anima escala e rotação com Reanimated.

## Arquitetura
- `services/`: Axios, autenticação TMDB e dados de demonstração.
- `queries/movies/`: consultas TanStack Query.
- `store/`: estado global do contador e dos favoritos.
- `storage/mmkv.ts`: armazenamento MMKV no Android/iOS.
- `storage/mmkv.web.ts`: alternativa localStorage no navegador, escolhida pelo Metro.
- `components/`: cartão e botão de coração animado.
- `screens/`: lista e detalhe.
- `routes/`: Stack Navigator do starter.
- `__tests__/`: testes de ações, persistência e recuperação de dados inválidos.

## Decisões técnicas
A opção A tem escopo pequeno e demonstra shared values, animated style, spring e worklet.
MMKV oferece acesso síncrono nativo, enquanto localStorage permite testar o fluxo no tablet.
A persistência manual segue a orientação do starter e salva apenas quando os IDs mudam.
O modo demonstração é explícito; a consulta real à TMDB é habilitada pelo `.env`.
As dependências Reanimated, Worklets e Babel foram alinhadas ao Expo SDK 54 do starter.

## Screenshot e screencast
Pendentes de captura pela aluna. Anexe mídias reais depois de executar; nenhuma evidência de execução foi fabricada.

## Testes
```bash
npm run typecheck
npm test -- --runInBand
```
O ZIP inclui `.github/workflows/test-amanda.yml` para executar estas verificações no fork quando a aluna enviar. Nenhum CI remoto foi executado pelo assistente.

## Referências
- Starter: https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/tree/main/exercicios/02-app-rn-navegacao-estado/starter
- Reanimated Expo SDK 54: https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/
- MMKV: https://github.com/mrousavy/react-native-mmkv/tree/3.x
- Zustand: https://github.com/pmndrs/zustand
- Codespaces: https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace
