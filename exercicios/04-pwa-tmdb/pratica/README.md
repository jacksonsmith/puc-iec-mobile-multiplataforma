# Atividade 4 — PWA TMDB

React + Vite com filmes populares em português, favoritos no localStorage,
IndexedDB, Service Worker e atualização por confirmação do usuário.

## Configurar e executar

```sh
cd exercicios/04-pwa-tmdb/pratica
npm ci
cp .env.example .env.local
```

No Windows, use `copy .env.example .env.local`. Em `.env.local`, preencha:

```dotenv
VITE_TMDB_TOKEN=seu_API_Read_Access_Token
```

Reutilize o **API Read Access Token** da atividade anterior, se disponível, ou
consulte https://www.themoviedb.org/settings/api. É o token longo (geralmente começa
com `eyJ`), não a API Key v3 de 32 caracteres. Não acrescente `Bearer`: o cliente
Axios já acrescenta esse prefixo. `.env.local` está ignorado pelo Git.

```sh
npm test
npm run build
npm run preview -- --host 0.0.0.0
```

Abra http://localhost:4173. No Codespaces, abra a porta 4173 no navegador;
continue usando o mesmo endereço durante os testes, pois o armazenamento é por origem.
O Service Worker funciona no **build/preview**, não em `npm run dev`.
Depois de trocar o token, gere o build novamente.

## O que foi implementado

- `fetchPopularMovies(page)`: `/movie/popular`, `language: pt-BR`, paginação e retorno de `data`.
- API em `NetworkFirst`, timeout de 3 s, `tmdb-api`, 50 entradas por até 1 dia.
- Pôsteres de **image.tmdb.org** em `CacheFirst`, `tmdb-images`, 200 entradas por até 7 dias; aceita respostas 0 e 200.
- Registro `prompt`, avisos de disponibilidade offline e nova versão, com Atualizar/Depois.
- Aba Favoritos filtrada, remoção e os dois estados vazios previstos no enunciado.
- Hook de conexão com estado inicial do navegador, listeners e cleanup; banner offline nos favoritos.

## Registrar evidências

1. Compare https://pwa-tmdb-aula4.vercel.app com um site comum e registre o que observou.
2. Abra o seu build online com token válido, aguarde os filmes e os pôsteres.
3. Em DevTools → Application, confira o Service Worker e os caches `tmdb-api` e
   `tmdb-images` **com itens**. Role a lista para carregar mais pôsteres se necessário.
4. Recarregue online uma vez para garantir que o Service Worker controla a página.
   Favorite um filme, ative DevTools → Network → Offline e recarregue.
5. Confira filmes/pôsteres, favorito persistido e banner na aba Favoritos; capture os prints.
6. Volte online. Com o preview aberto, altere um texto visível e execute `npm run build`.
   Em Application → Service Workers clique Update; aguarde “Nova versão disponível”.
   Depois deve apenas dispensar; Atualizar deve ativar a versão e recarregar.
7. Se alterar um texto só para o teste, desfaça essa alteração após a captura.
8. Salve os prints em `evidencias/` e atualize [ENTREGA.md](ENTREGA.md).

O aviso “App pronto para uso offline” confirma o cache do shell. A API e os
pôsteres só entram nos respectivos caches depois de serem acessados online.
O modo avião simulado da base não substitui o teste real no DevTools.

## Validação e limites

`npm test` cobre o serviço TMDB, card, favoritos, conexão, aba Favoritos e avisos
de atualização. Os testes usam mocks; não exigem nem validam o token pessoal.
O build gera `dist/sw.js` e o manifest instalável. O validador estrutural do
professor confere os TODOs; os 3 pontos de evidências/reflexão dependem da revisão manual.
A suíte e2e fornecida depende de navegador e token válido e não foi executada nesta entrega.

## Evidências registradas

O Codespaces confirmou 19 testes aprovados. A execução com token pessoal foi
registrada com caches preenchidos, favoritos offline e atualização por confirmação
(versão aguardando e versão ativada). Consulte os seis prints em [ENTREGA.md](ENTREGA.md).
A instalação e abertura em janela própria também foram registradas.
A comparação direta também foi registrada: o PWA do professor manteve filmes
após reload offline, enquanto a navegação offline no site TMDB falhou.
As nove capturas e os limites da comparação estão no ENTREGA.md.
