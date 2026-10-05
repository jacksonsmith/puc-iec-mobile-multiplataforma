# ADR-0001: Stack mobile para marketplace de moda de segunda mão

## Status

`Aceito`

**Data:** 2026-09-25
**Autor:** Paulo Henrique Nunes Vanderley

## Contexto

- **Produto:** marketplace de moda de segunda mão (brechó, estilo Repassa) — venda e compra de peças usadas, com curadoria da peça antes de entrar no catálogo.
- **Escala alvo:** MVP regional, poucos milhares de compradores e algumas centenas de vendedores no primeiro semestre.
- **Time:** 3 devs. Backend já decidido como plataforma headless (Solidus ou Bagisto) — o mobile só consome a API; essa escolha não é escopo deste ADR.
- **Restrição:** orçamento de startup, MVP em 3-4 meses, UX depende muito de foto (catálogo, curadoria). Time não sustenta duas bases nativas em paralelo.

## Decisão

Adotaremos **Flutter**.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **Flutter** (escolhida) | Renderer próprio garante UI idêntica em Android/iOS — crítico num catálogo que vive de foto. Caso real de marketplace de segunda mão em escala usando Flutter (Xianyu, Alibaba). | Pool de devs Flutter é menor que RN no Brasil. |
| React Native | Pool de devs maior; aproveita time com background JS/web. | Componentes mapeados para nativos de cada plataforma tendem a variar mais visualmente entre si — o oposto do que o produto precisa. |
| Nativo (Kotlin + Swift) | Melhor UX/performance possível, controle total de câmera. | Duas bases de código para 3 devs em 3-4 meses é inviável. |

PWA e KMP ficaram fora da tabela: PWA porque upload de foto pela câmera ainda é inconsistente entre navegadores — o tipo de limite que Charland e Leroux (2011) já descreviam como restrição técnica real, não ideologia. KMP porque seu ganho é compartilhar lógica entre bases nativas já existentes, e aqui tudo começa do zero.

## Consequências

**Positivas:** uma base de código com UI consistente entre plataformas, que é o que mais importa num app onde a peça precisa parecer confiável na foto.

**Negativas:** crescer o time Flutter depois do MVP é mais difícil que RN no mercado brasileiro hoje. Se o SDK do backend escolhido (Solidus/Bagisto) vier pronto só para RN, a integração fica mais manual do lado Flutter — vale checar isso antes de fechar a decisão de backend.

## Referências

- Flutter — documentação oficial. https://docs.flutter.dev
- Google/Flutter Showcase — caso Xianyu (Idle Fish), marketplace de segunda mão da Alibaba em Flutter. https://flutter.dev/showcase
- Charland, A.; Leroux, B. (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5).
