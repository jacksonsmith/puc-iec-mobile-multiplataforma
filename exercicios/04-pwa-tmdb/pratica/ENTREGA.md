# Entrega — PWA TMDB

## Identificação

- Aluno: Marcus Vinicius da Cruz Santos
- Atividade: PWA TMDB — filmes populares, instalável e offline
- Branch: `atividade-04`

## Implementações realizadas

- `fetchPopularMovies` com `tmdbClient.get`, idioma `pt-BR`, paginação e retorno dos dados.
- Testes de `useFavorites` para toggle duplo, persistência e badge.
- Aba Favoritos com filtragem, cards e estados vazios.
- `useOfflineStatus` com estado inicial baseado em `navigator.onLine`, listeners e cleanup.
- Cache da API TMDB com `NetworkFirst` e timeout de rede de 3 segundos.
- Cache dos pôsteres com `CacheFirst` para `image.tmdb.org`.
- Registro da PWA com `registerType: 'prompt'`.
- Componente `UpdatePrompt` usando `useRegisterSW`, com atualização e descarte do aviso.

## Validações automatizadas

Executadas na pasta `pratica`:

```text
npm test
10 testes passaram; o teste opcional de page=1 permanece fora do escopo.

npm run build
Build de produção concluído com sucesso.
```

O validator estrutural também aprovou os requisitos obrigatórios disponíveis no repositório.

## Evidências manuais

As imagens abaixo devem ser anexadas ao PR ou ao Canvas após a execução local. Elas são
referências do que foi verificado, não substituem a captura de tela exigida pela avaliação.

### 1. Instalação da PWA

1. Execute `npm run build`.
2. Execute `npm run preview`.
3. Abra a URL exibida pelo Vite em uma janela anônima ou navegador compatível.
4. No DevTools, abra **Application > Manifest** e confirme o manifesto e o modo `standalone`.
5. Use o botão de instalação do navegador e confirme que o app abre como PWA.

**Evidência:** anexar captura do manifesto e da instalação concluída.

### 2. Cache da API e funcionamento offline

1. Carregue a lista de filmes com a rede disponível.
2. No DevTools, abra **Application > Service Workers** e confirme o Service Worker ativo.
3. Em **Network**, filtre por `api.themoviedb.org` e confirme a resposta da API.
4. Em **Network > Throttling**, selecione **Offline**.
5. Recarregue ou abra a aba **Favoritos** e confirme que os dados previamente armazenados
   continuam disponíveis.

**Evidência:** anexar captura do Service Worker ativo e da lista exibida offline.

### 3. Cache dos pôsteres

1. Com a rede disponível, abra o DevTools e filtre as requisições por `image.tmdb.org`.
2. Confirme que os pôsteres são carregados pelo host `image.tmdb.org`.
3. Selecione **Offline** e recarregue a página.
4. Confirme que os pôsteres já visitados continuam disponíveis no cache.

**Evidência:** anexar captura da requisição do pôster e da resposta proveniente do cache.

### 4. Atualização com prompt

1. Abra uma versão publicada ou servida pelo preview.
2. Gere uma nova versão do build e reinicie o preview.
3. Ao detectar a nova versão, confirme o aviso **Uma nova versão está disponível**.
4. Clique em **Atualizar agora** e confirme o recarregamento da aplicação.

**Evidência:** anexar captura do aviso de atualização e, se possível, do Service Worker
atualizado.

## Comparação: site responsivo × PWA instalada

| Aspecto | Site responsivo | PWA instalada |
|---|---|---|
| Acesso | Navegador e URL | Ícone próprio e janela standalone |
| Instalação | Não se aplica | Pode ser instalada no dispositivo |
| Offline | Depende do cache do navegador | Usa Service Worker, cache e IndexedDB |
| Atualização | Nova versão ao recarregar a página | Aviso controlado pelo usuário via prompt |
| Experiência | Mantém a interface do navegador | Experiência semelhante a aplicativo |

## Reflexão: `autoUpdate` × `prompt`

`autoUpdate` aplica uma nova versão assim que o Service Worker consegue instalá-la. Essa
opção reduz a chance de o usuário permanecer em uma versão antiga, mas pode atualizar a
aplicação durante uma tarefa e causar uma mudança inesperada ou interromper o estado atual.

`prompt` separa a instalação da nova versão da ativação. O usuário recebe um aviso e decide
quando atualizar, o que é mais previsível para uma PWA que funciona offline e pode estar
mantendo dados em cache. Nesta atividade, `prompt` foi escolhido porque torna a atualização
visível, permite explicar a mudança e evita recarregamentos inesperados.
