# Spec 005 — Favoritos persistentes

- **Status:** rascunho
- **Responsável:** _a definir_
- **Relacionados:** PDR 0002, PDR 0004, ADR 0004

## História de usuário
Como fã, quero marcar meus filmes preferidos e vê-los sempre no topo da tela inicial, mesmo depois de fechar o app.

## Critérios de aceite
- [ ] CA1 — No detalhe (Spec 002), o botão **Favoritar / Nos favoritos** alterna o favorito, com animação (Moti) e háptico (`expo-haptics`).
- [ ] CA2 — **Seus favoritos** é sempre a primeira fileira da tela inicial, com os favoritos mais recentes primeiro e a contagem "★ N" em `lamp`.
- [ ] CA3 — Nos cards de qualquer fileira, filme favorito mostra a ★ de vidro no canto do pôster; não favorito não mostra nada.
- [ ] CA4 — Favoritos **sobrevivem a fechar e reabrir o app** (persistidos localmente).
- [ ] CA5 — Sem favoritos: a fileira continua no topo com o card "Nenhum favorito ainda · Toque na ★ de um filme para guardá-lo aqui."
- [ ] CA6 — "Ver todos ›" abre a lista completa de favoritos em grade (substitui a aba Favoritos do exemplo do enunciado).
- [ ] CA7 — Botão com `accessibilityLabel` "Adicionar aos favoritos" / "Remover dos favoritos".

## Verificação
- Flow Maestro: `e2e/maestro/05-favoritos.yaml` — abre um filme, toca `favorite-toggle-<id>`, volta, verifica o card dentro de `rail-favorites`; `stopApp` + `launchApp` e verifica de novo.
- Vitest: `toggleFavorite(ids, id)` adiciona/remove sem duplicar e mantém a ordem (mais recente primeiro).
