# ENTREGA — Atividade 4 (PWA)

**Nome:** Luiz Felipe Lima · **GitHub:** luizfereslima

---

## 1. Site comum × PWA — observações e evidências

> **Pendente de validação manual.** O navegador não autorizou abrir o PWA publicado ou o preview local nesta sessão, então não registrei observações como se tivesse feito o teste. Também não há `.env.local` com token TMDB neste checkout. Depois de configurar o token e testar o site publicado, o preview e um site comum, substitua esta nota pelas diferenças observadas e adicione os prints em `evidencias/`.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | Preencher após testar recarga sem rede | Verificar se lista e shell abrem com cache | `evidencias/01-offline.png` |
| 2 | Preencher após testar fechar e reabrir | Verificar persistência dos dados e abertura instalada | `evidencias/02-reabertura.png` |
| 3 | Preencher após comparar navegador e instalação | Verificar janela instalada e opção de instalação | `evidencias/03-instalacao.png` |

## 2. Prova do offline no meu build

- [ ] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` contendo itens: `evidencias/04-cache-storage.png`
- [ ] Print do app carregando a lista em **modo avião**: `evidencias/05-modo-aviao.png`
- [ ] Print do aviso **"Nova versão disponível"**: `evidencias/06-nova-versao.png`

Os prints do preview também dependem da configuração do token e do acesso ao navegador.

## 3. Reflexão (6 linhas)

Para checkout, eu escolheria `prompt` e atualizaria entre compras, nunca durante o pagamento.
Um reload no meio da compra pode apagar o carrinho, interromper a confirmação ou levar a um envio duplicado.
O risco do `prompt` é o usuário continuar numa versão antiga com bug ou correção de segurança pendente.
Para notícias, eu escolheria `autoUpdate`, pois manter a interface e as correções atuais tem baixo custo para a leitura.
O risco é um reload interromper a leitura e apagar a posição do artigo.
Se a leitura estiver em andamento, o app deve preservar a posição ou adiar a atualização.

## 4. Declaração de uso de IA

Usei IA para implementar os TODOs de serviço, cache, atualização, favoritos e conectividade, além de revisar o texto da reflexão. Não gerei evidências manuais; os prints e observações acima ainda precisam ser coletados no navegador.
