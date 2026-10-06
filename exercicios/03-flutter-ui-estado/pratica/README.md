# README — Atividade 3 — Henrique Miguel de Jesus

## Identificação

- **Aluno:** Henrique Miguel de Jesus
- **Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma (PUC Minas - IEC)
- **Atividade:** 03 — App Flutter: UI + Estado + Firebase + Offline-first

---

## Como rodar o projeto

1. Entre na pasta do projeto Flutter:
   ```bash
   cd exercicios/03-flutter-ui-estado/pratica
   ```

2. Obtenha as dependências:
   ```bash
   flutter pub get
   ```

3. Execute os testes automatizados da aplicação:
   ```bash
   flutter test
   ```

4. Inicie a aplicação na Web com a porta fixa recomendada:
   ```bash
   flutter run -d chrome --web-port 5300
   ```

---

## O que foi implementado

- **Ex1 (TASK 1):** Composição da widget `MovieCard` combinando `PosterArt`, `Column`, título (20, bold), nota com estrela (`Icons.star`), e ano do filme.
- **Ex2 (TASK 2, 4, 5, 6):** Gestão de estado dos favoritos via Riverpod com `favoritesProvider` (`Notifier<Set<int>>`). Atualização dinâmica e sincronizada no card, no contador do header (`♥ count`) e ação no botão de limpar (`Icons.delete_outline`).
- **Ex3 (TASK 9):** Suíte de teste unitário isolado do `favoritesProvider` utilizando `ProviderContainer` em `test/favorites_test.dart`.
- **Ex4 (TASK 3, 7, 10):** Integração com **Firebase Firestore** para sincronização cloud e persistência de favoritos via documento remoto com `persistenceEnabled: true`.
- **Ex5 (TASK 8):** Integração com **Firebase Remote Config** em `remote_config.dart` e exibição dinâmica da mensagem remota no topo da `HomeScreen`.
- **Ex6 (TASK 11–15):** Arquitetura **Offline-first**:
  - `OfflineBanner` com aviso em tempo real quando sem conexão (`TASK 11`).
  - Serialização `Movie.toJson()` e `Movie.fromJson()` (`TASK 12`).
  - `MovieRepository` com estratégia **Cache-First (Stale-while-revalidate)** e controle de validade **TTL** (`TASK 13` e `TASK 14`).
  - `SyncQueue` com resolução automática de conflitos (operações opostas se anulam) e `flush` seguro e ordenado (`TASK 15`).

---

## Análise de Trade-offs: Estado Local vs. Cloud vs. Offline-First (1 Parágrafo)

> O estado **local em memória** (Riverpod) oferece resposta instantânea e latência zero para a interface sem dependência de rede, porém é um estado volátil que não sobrevive ao encerramento do app ou reload da página. A integração com **Cloud** (Firestore) resolve a persistência e permite a sincronização síncrona entre múltiplos dispositivos, contudo introduz dependência de conexão, latência de rede e potenciais falhas de I/O em ambientes de alta oscilação de sinal. A arquitetura **Offline-First** (Cache-First + Fila de Sincronização) unifica as vantagens de ambas abordagens: o usuário interage sempre com o cache local persistido no dispositivo com latência imperceptível, enquanto a `SyncQueue` gerencia as gravações remotas e a resolução de conflitos em segundo plano assim que a conectividade é reestabelecida, garantindo um produto altamente resiliente, performático e confiável.
