# Filmes (Flutter) — pratica/ da Atividade 3

App de catálogo de filmes em **Flutter**.

## Como rodar

```bash
flutter pub get
flutter run -d chrome
```

## Como executar testes

```bash
flutter test
flutter analyze
```

## Por que providers sao melhores que prop drilling?

Usar um provider ao inves de prop drilling porque elimina a necessidade de passar
dados por componentes intermediarios que nao necessitam dos dados. Isso facilita a
manutenabilidade do codigo, melhora a legibilidade e facilita a refatoraçao.
Prop drilling e melhor usado em casos de componentes altamente reusaveis, que
teriam vantagem em nao ter um contexto especifico atrelado, e em casos de hierarquias
de componentes com poucos niveis.