# Trabalho final — CineHub

Projeto integrador: você trabalha sobre **um app de filmes + backend próprio** (`server/`),
escolhendo tasks de um board. Cada task é um pedaço real de engenharia ou de qualidade.

## Como compor sua nota
1. Veja o catálogo em [`tasks/TASKS.md`](tasks/TASKS.md). Cada task vale **S/M/L → N pts**.
2. **Escolha tasks que somem pelo menos os pontos exigidos pela sua disciplina** (no Canvas).
   Pode misturar dificuldades; **profundidade conta mais que quantidade rasa**.
3. Entregue cada task num **PR** (1 PR = 1 task). O bot comenta o **piso automático**.
4. A nota final = piso automático **+ avaliação manual** (📝: design/ADR, relatório de bug/segurança)
   **+ apresentação** (ver [`APRESENTACAO.md`](APRESENTACAO.md)). É lançada no Canvas.

## Entrega (passo a passo)
```bash
# 0. fork do repo da sua disciplina, clone, e:
cd capstone/server && npm install && npm run seed && npm test   # baseline verde
# 1. pegue uma Issue do board (comente pra reservar)
# 2. branch no padrão exato (o bot resolve a task pelo nome):
git checkout -b task/<id-da-task>-<seu-login>
# 3. resolva, commite, e abra PR vinculando a Issue (Closes #N)
```
> **Regra do nome da branch:** `task/<id-da-task>-<seu-login>`. Sem isso o bot não acha a task.

## Prazos
Definidos no Canvas da sua disciplina. O bot aceita PR/commit até a data; correção manual e
apresentação seguem o cronograma da turma.

## Regras
- **1 PR = 1 task.** Quer fazer N tasks? N PRs.
- Não edite arquivos de outra task no mesmo PR (atrapalha o grader).
- Tudo que precisa de avaliação humana (ADR, relatório, screenshot, screencast) vai **no PR** + citado na apresentação.
