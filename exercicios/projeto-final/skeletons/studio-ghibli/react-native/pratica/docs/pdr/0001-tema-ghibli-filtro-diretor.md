# PDR 0001 — Tema Studio Ghibli com filtro por diretor

- **Status:** aceito
- **Data:** 2026-11-07

## Contexto
O projeto final oferece 5 temas prontos (Opção A) ou API própria (Opção B). A Aula 6 cita a pasta `pratica/` e flows Maestro preparados para os temas prontos.

## Decisão de produto
Opção A — **Studio Ghibli** (`ghibliapi.vercel.app`), com o filtro natural indicado pelo professor: **diretor**.

## Alternativas descartadas
- **API própria (Opção B):** teríamos que montar CI/flows do zero.
- **Outros temas prontos:** Ghibli tem API sem chave (zero risco de commitar segredo) e só 22 itens (busca e filtro locais e instantâneos).

## Pendências
- [ ] Reservar **"Studio Ghibli + React Native"** via issue no repo da disciplina.
- [ ] Confirmar a URL da API usada no skeleton.

## Como vamos saber se deu certo
As 5 features demonstradas ao vivo, sem tela branca, mesmo com a API fora do ar (cache).
