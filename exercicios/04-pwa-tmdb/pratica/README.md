# A4 — PWA TMDB: filmes instalável e offline

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma — PUC Minas IEC

---

## Antes de começar

**Clone novo** (nunca sincronize fork antigo — é isso que gera conflito):

```bash
git clone https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma.git a4-pwa
cd a4-pwa
git switch -c feat/a4-pwa
git remote add meu https://github.com/<seu-login>/puc-iec-mobile-multiplataforma.git

# Entre na pasta do exercício e confirme que está no lugar certo
cd exercicios/04-pwa-tmdb/pratica
ls src/services          # → deve mostrar: tmdb.ts  db.ts
```

> **Windows:** `cd exercicios\04-pwa-tmdb\pratica` e `dir src\services`

```bash
npm install
cp .env.example .env.local        # Windows: copy .env.example .env.local
# Edite .env.local → VITE_TMDB_TOKEN=<seu token>
# Gere em: https://www.themoviedb.org/settings/api  (Read Access Token, grátis)
npm run dev                       # http://localhost:5173
```

---

## Roteiro

### Em aula com o professor (não avaliativo)

1. Missão **site comum × PWA** (celular) · leitura de `01-MovieCard.test.tsx` (📘 modelo)
2. **TODO 1** — você faz sozinho; `npm test` fica verde

### Solo em casa (avaliativo)

| Ordem | Onde | O quê | Dificuldade |
|---|---|---|---|
| 1 | `vite.config.ts` | **TODO 2** — `runtimeCaching` (API e pôsteres) | MÉDIO |
| 2 | `vite.config.ts` + `src/components/UpdatePrompt.tsx` | **TODO 3** — atualização do app | MÉDIO |
| 3 | `src/screens/HomeScreen.tsx` | **TODO 4** — aba Favoritos | FÁCIL |
| 4 | `src/hooks/useOfflineStatus.ts` | **TODO 5** — hook online/offline + banner | FÁCIL |
| 5 | `ENTREGA.md` | evidências + reflexão | — |

A especificação de cada TODO está nos comentários do arquivo e no [`enunciado.md`](../enunciado.md).

---

## Como verificar

```bash
npm test                      # TODO 1 (e os testes-modelo)
npm run build && npm run preview   # http://localhost:4173 — o Service Worker SÓ roda aqui, não no npm run dev
```

No preview: DevTools → **Application** → Service Workers · Cache Storage · Manifest. Para simular offline: Network → **Offline**.

> **Deu `webServer was not able to start` ou erro estranho de merge?** Não resolva — clone de novo numa pasta nova e copie só os arquivos que você editou.

---

## Arquivos

```
pratica/
  vite.config.ts                 ← ✏️  TODO 2 e TODO 3 (parte 1)
  ENTREGA.md                     ← ✏️  evidências + reflexão (manual)
  src/
    services/tmdb.ts             ← ✏️  TODO 1
    components/UpdatePrompt.tsx  ← ✏️  TODO 3 (parte 2)
    screens/HomeScreen.tsx       ← ✏️  TODO 4
    hooks/useOfflineStatus.ts    ← ✏️  TODO 5
    repositories/moviesRepository.ts  ← IndexedDB + estratégias (já pronto)
    __tests__/unit/              ← 01 📘 modelo · 02 TODO 1 · 03 📘 modelo
```

---

## Entrega

Veja a seção **Entrega** do [`enunciado.md`](../enunciado.md) (clone novo → branch `feat/a4-pwa` → remote `meu` → PR).
O bot J.A.R.V.I.S. comenta a nota mínima automática a cada commit.
