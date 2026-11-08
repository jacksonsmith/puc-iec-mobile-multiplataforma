# Como contribuir

Este projeto segue **Spec Driven Development** — veja [`docs/README.md`](docs/README.md).

## Fluxo de trabalho
1. **Spec primeiro.** Toda feature começa em `docs/specs/NNN-*/spec.md`, revisada por pelo menos 1 colega.
2. **Plan e tasks.** Preencha `plan.md` e `tasks.md`; cada task vira uma issue com responsável.
3. **Branch por task**, a partir de `main`:
   - `feat/001-lista-T4-film-card`
   - `fix/005-favoritos-persistencia`
   - `docs/adr-0007-...`
4. **PR pequeno** (uma task) usando o template, com pelo menos 1 aprovação. Nada de push direto em `main`.
5. Decisão técnica nova → ADR. Decisão de produto nova → PDR.

## Commits — Conventional Commits
```
feat(lista): adiciona skeleton de carregamento
fix(favoritos): evita duplicar id ao favoritar duas vezes
test(domain): cobre filterFilms com acentos
docs(adr): registra escolha de NativeWind
```
Cada pessoa commita **com a própria conta** — a contribuição individual é avaliada pelos commits.

## Definition of Done (checklist do PR)
- [ ] Atende os critérios de aceite da spec (CA citados no PR)
- [ ] `npx tsc --noEmit` e `npx expo lint` sem erros
- [ ] Testes Vitest da camada `domain`/`data` passando
- [ ] `testID` seguindo a convenção de `docs/README.md`
- [ ] Flow Maestro da spec passando (quando a task o afeta)
- [ ] Estados carregando / vazio / erro tratados
- [ ] Funciona em claro e escuro
- [ ] `tasks.md` atualizado

## Padrão de nomes
Nomes no código ficam em **inglês**. Textos da interface e documentação ficam em português do Brasil.

### Arquivos e pastas
| O quê | Padrão | Exemplo |
|---|---|---|
| Pastas | kebab-case | `src/components/`, `docs/specs/001-lista-filmes/` |
| Arquivos em geral | kebab-case | `ghibli-api.ts`, `mappers.ts` |
| Componentes | kebab-case, com o nome do componente | `film-card.tsx` exporta `FilmCard` |
| Hooks | kebab-case, começando com `use-` | `use-films.ts` exporta `useFilms` |
| Stores do Zustand | kebab-case, terminando em `-store` | `favorites-store.ts` exporta `useFavoritesStore` |
| Telas (`src/app`) | kebab-case, nas regras do Expo Router | `index.tsx`, `film/[id].tsx`, `_layout.tsx` |
| Versão por plataforma | sufixo antes da extensão | `app-tabs.web.tsx` |
| Testes Vitest | mesmo nome do arquivo testado + `.test` | `filter.test.ts` |
| Flows Maestro | número da spec + nome | `e2e/maestro/01-lista.yaml` |

### Código
| O quê | Padrão | Exemplo |
|---|---|---|
| Variáveis e parâmetros | camelCase | `selectedDirector`, `filmId` |
| Booleanos | camelCase, com `is`, `has`, `can` ou `should` | `isFavorite`, `hasError` |
| Constantes fixas no nível do arquivo | SCREAMING_SNAKE_CASE, com a unidade quando houver | `RATTLE_STEP_MS`, `MAX_RETRIES` |
| Valores calculados dentro de funções | camelCase, mesmo com `const` | `const visibleFilms = ...` |
| Objetos de configuração e mapas | camelCase | `const filmKeys = { ... }` |
| Funções | camelCase, começando com verbo | `filterFilms`, `formatDuration` |
| Conversão de dados | camelCase, começando com `to` | `toFilm(dto)` |
| Funções que tratam eventos | `handle` + evento | `handleToggleFavorite` |
| Props de evento | `on` + evento | `onPress`, `onToggle` |
| Componentes | PascalCase | `FilmCard` |
| Hooks | camelCase, começando com `use` | `useFilmFilters` |
| Types e interfaces | PascalCase, sem prefixo `I` ou `T` | `Film`, `Director` |
| Props de componente | nome do componente + `Props` | `FilmCardProps` |
| Dados como vêm da API | nome + `Dto` | `FilmDto` |
| Parâmetros genéricos | `T`, ou `T` + descrição | `T`, `TItem` |
| Classes | PascalCase, como substantivo | `GhibliApiError` |
| Enums | PascalCase no nome e nos membros | `FilmSort.ReleaseDate` |
| Variáveis de ambiente | SCREAMING_SNAKE_CASE, com `EXPO_PUBLIC_` se forem para o app | `EXPO_PUBLIC_API_URL` |
| Siglas | tratadas como palavra | `apiUrl`, `FilmDto` (não `APIURL`, `FilmDTO`) |

### Quando usar cada tipo
- **`type` é o padrão** para descrever dados e props. Use `interface` só quando outro código precisar estendê-la.
- **Prefira união de textos a `enum`**: `type FilmSort = 'score' | 'releaseDate'`. É mais simples e não gera código extra no app. Use `enum` só se os membros precisarem ser percorridos ou reutilizados como valores.
- **Prefira funções a classes.** O uso comum de classe aqui são erros personalizados, que estendem `Error`.
- Tokens de design e `testID` são kebab-case e têm regras próprias: PDR 0003 e [`docs/README.md`](docs/README.md).

## Formatação
O Prettier formata o código e o ESLint avisa quando algo está fora do padrão, então um erro de formatação aparece no `npx expo lint`. A configuração fica em `.prettierrc`: 2 espaços, aspas simples, ponto e vírgula e linhas de até 100 caracteres.

- `npm run format` formata o código da pasta `src`.
- No VS Code, instale a extensão recomendada do Prettier para formatar ao salvar.

## Regras de arquitetura
- `src/domain` não importa React, React Native nem nada de `src/` fora dele.
- Telas em `src/app` só compõem componentes e hooks — sem `fetch` direto.
- Nenhuma cor/espaçamento hardcoded: use os tokens do Tailwind (PDR 0003).
- Nunca commitar `.env`, chaves ou `local.properties`.
