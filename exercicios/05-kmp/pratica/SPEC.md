# Especificação — Atividade 5: Filmes Populares KMP

## Objetivo

Completar a interface compartilhada em Compose Multiplatform para apresentar os
filmes populares retornados pelo `TmdbApi`. A camada de rede e a configuração do
token não fazem parte desta implementação.

## Escopo e critérios de aceite

| Requisito | Comportamento verificável |
| --- | --- |
| Estados da tela | Sem token, mostra a orientação de configuração; durante a busca, mostra um indicador centralizado; em erro, mostra a mensagem recebida; com sucesso, mostra a lista. |
| Lista | Usa `LazyColumn`, cabeçalho com a quantidade de filmes, espaçamento de 12dp e um `MovieCard` para cada filme. |
| Card | Exibe placeholder com a inicial do título, título e sinopse limitados a duas linhas, além de nota e ano. |
| Segurança | O token permanece somente em `local.properties`, arquivo ignorado pelo Git. |
| Build | `:androidApp:assembleDebug` conclui com sucesso; este é o critério eliminatório da atividade. |

## Decisões de interface

- O poster é um placeholder colorido para não introduzir uma dependência de
  carregamento de imagem no exercício.
- Uma sinopse vazia recebe um texto de fallback e uma data ausente apresenta
  `Ano não informado`.
- Cada item da lista usa o id do filme como chave estável.

## Validação

```bash
./gradlew :androidApp:assembleDebug
cd ../grader
npm ci
npm run validate -- --entrega ../pratica --build-ok true
```

O validador deve reportar `autoScore: 10/10`. A execução do app no Android com
um token TMDB válido confirma os estados de carregamento, sucesso e erro de rede.
