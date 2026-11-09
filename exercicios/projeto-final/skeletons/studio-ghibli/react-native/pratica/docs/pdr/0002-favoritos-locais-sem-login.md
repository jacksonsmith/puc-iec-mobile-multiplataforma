# PDR 0002 — Favoritos locais, sem login

- **Status:** aceito
- **Data:** 2026-11-07

## Contexto
O enunciado exige que os favoritos "sobrevivam a fechar o app". A API Ghibli é somente leitura.

## Decisão de produto
Favoritos guardados **apenas no dispositivo**, sem conta nem sincronização.

## Alternativas descartadas
- **Login + backend (ex.: Supabase):** fora do escopo do enunciado, adiciona tela de login e risco na demo.

## Como vamos saber se deu certo
Flow `05-favoritos.yaml` passa reiniciando o app no meio.
