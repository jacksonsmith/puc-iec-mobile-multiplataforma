# Observações da comparação (26/10/2026)

Estas capturas e verificações são do PWA publicado pelo professor e de `https://www.themoviedb.org/`; não são evidências do build local da atividade.

- **Site comum:** a página abriu com navegação Movies/TV Shows/People/Awards, busca, destaque e seção Trending. A captura está em `site-comum-tmdb.png`.
- **PWA do professor:** a interface exibiu Filmes Populares em cards, controles Online/Offline e Favoritar. A captura da tela está em `pwa-professor-offline-simulado.png`.
- **Teste de rede:** com a rede do navegador desligada e recarga da página, o site comum falhou com `net::ERR_INTERNET_DISCONNECTED`. No PWA, a recarga offline manteve os filmes e o texto `Reload feito — dados vêm do IndexedDB`; a captura está em `pwa-professor-modo-offline.png`.
- **Service Worker/Cache Storage:** na inspeção, o site comum tinha 0 registros de Service Worker e nenhuma chave no Cache Storage. O PWA tinha 1 Service Worker, a chave `workbox-precache-v2-https://pwa-tmdb-aula4.vercel.app/` e, na primeira visita, exibiu `App pronto para uso offline`.
- **Escopo:** essas observações demonstram o comportamento do site comum e da demonstração publicada. Ainda é necessário repetir os testes no build próprio para evidenciar os caches `tmdb-api`/`tmdb-images` e o prompt de atualização.
