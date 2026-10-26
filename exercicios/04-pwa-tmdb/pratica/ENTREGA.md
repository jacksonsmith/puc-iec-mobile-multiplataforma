# ENTREGA — Atividade 4 (PWA)

**Nome:** João Vítor Vieira Martins · **GitHub:** joaovito9

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

| #   | Site comum (themoviedb.org)                                     | PWA                                                                                        | Print/evidência                                                    |
| --- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 1   | Offline + recarregar → página de erro do navegador (dinossauro) | Offline + recarregar → app abre e mostra a lista vinda do cache                            | `evidencias/site-comum-offline.png` · `evidencias/pwa-offline.png` |
| 2   | Só abre numa aba do navegador                                   | Pode ser instalado: ícone próprio e janela sem barra de endereço (`display: standalone`)   | `evidencias/instalado.png`                                         |
| 3   | Sempre baixa tudo da rede de novo                               | Service Worker guarda API e pôsteres no Cache Storage; os pôsteres já vistos abrem na hora | `evidencias/cache-storage.png`                                     |

## 2. Prova do offline no SEU build

- [x] Cache Storage com `tmdb-api` e `tmdb-images`: ![Cache Storage](evidencias/cache-storage.png)
- [x] App em modo offline carregando a lista: ![Offline](evidencias/pwa-offline.png)
- [x] Aviso "Nova versão disponível": ![Nova versão](evidencias/nova-versao.png)

## 3. Reflexão

Para um app de **checkout** eu escolheria `prompt`. Um `autoUpdate` pode recarregar a página no meio
do pagamento e fazer o usuário perder o carrinho ou os dados do formulário, ou até gerar uma
cobrança duplicada. Com `prompt`, o usuário termina a compra e atualiza quando quiser. O risco é ele
ignorar o aviso e ficar muito tempo numa versão antiga, por exemplo com uma regra de preço
desatualizada. Para um app de **notícias** eu escolheria `autoUpdate`: o conteúdo é só leitura, não
há nada a perder num recarregamento, e é melhor que todos recebam correções e o layout novo sem
precisar clicar. O risco é a página recarregar enquanto alguém lê uma matéria e perder a posição
da leitura.

## 4. Declaração de uso de IA

Usei o Claude (Anthropic) como tutor durante toda a atividade: ele explicou os conceitos (Service
Worker, estratégias NetworkFirst e CacheFirst, resposta opaca, `autoUpdate` × `prompt`), sugeriu o
código de cada TODO e me ajudou a validar no navegador e a resolver problemas de ambiente (Node 25
nos testes). Executei, testei e revisei cada passo, e os prints e as observações da seção 1 são meus.
