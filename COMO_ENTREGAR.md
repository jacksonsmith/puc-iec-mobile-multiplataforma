# Como entregar atividades pelo GitHub

Guia oficial das disciplinas do **PUC Minas IEC** ministradas pelo Prof. Jackson Smith Moisés Matias.

Todas as atividades são entregues via **GitHub** + link colado no Canvas. Esse formato é padrão de mercado em engenharia de software — você sai da disciplina já com workflow profissional dominado.

---

## Repos públicos das disciplinas

Use o da sua disciplina como base:

| Disciplina | Repo público |
|---|---|
| Arquitetura de Aplicações Móveis e Multiplataforma | <https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma> |
| Testes de Aplicações Mobile | <https://github.com/jacksonsmith/puc-iec-testes-aplicacoes-mobile> |

Os enunciados das atividades ficam dentro da pasta `exercicios/` do repo. **Você não comita no repo do professor** — você trabalha no **seu próprio fork**.

---

## Pré-requisitos (uma vez na vida)

1. **Conta GitHub.** Crie em <https://github.com/signup> se não tiver. Use e-mail acadêmico ou pessoal — vai pra carreira.
2. **Git instalado.**
   - macOS: `brew install git`
   - Linux (Debian/Ubuntu): `sudo apt install git`
   - Windows: <https://git-scm.com/download/win>
3. **Identidade git configurada:**
   ```bash
   git config --global user.name "Seu Nome Completo"
   git config --global user.email "seu@email.com"
   ```
4. **Auth GitHub** (escolha um):
   - **HTTPS + Personal Access Token** (mais fácil): GitHub → Settings → Developer settings → Personal access tokens → Generate new token (scope `repo`). Use o token como senha no `git push`.
   - **SSH** (mais robusto): `ssh-keygen -t ed25519` → adicionar chave pública em GitHub → Settings → SSH keys.

---

## Workflow de entrega (7 passos)

### 1. Fork do repo da disciplina

Abra o repo da disciplina no navegador e clique em **Fork** (canto superior direito). Isso cria uma cópia no seu usuário.

### 2. Clonar seu fork localmente

```bash
git clone https://github.com/SEU-USUARIO/puc-iec-mobile-multiplataforma.git
cd puc-iec-mobile-multiplataforma
```

(Troque pelo nome do repo da sua disciplina.)

### 3. Criar branch da atividade

Padrão: `entrega/atividade-<N>-<seu-nome-em-kebab>`

```bash
git checkout -b entrega/atividade-1-joao-silva
```

### 4. Trabalhar dentro de `exercicios/<atividade>/` no SEU fork

> ⚠️ **Você só altera o SEU fork.** O repo do professor (upstream) **nunca recebe commit direto** — só recebe seu trabalho via Pull Request.

Cada atividade tem uma pasta no repo público. **No seu fork**, crie seu arquivo dentro da pasta da atividade, no nível dela. Não precisa criar subpastas — só seu arquivo.

**Exemplo Testes Mobile (Atividade 1 — Casos de Teste Funcionais):**

```
exercicios/01-casos-de-teste-funcionais/
├── enunciado.md            ← do professor (não mexer)
├── template-relatorio.md   ← copie isso pra começar
├── guia-redacao-casos.md
└── joao-silva.md           ← SEU arquivo (NO SEU FORK)
```

**Exemplo Arquitetura (Atividade 1 — ADR):**

```
exercicios/01-adr-arquitetural/
├── enunciado.md
├── adr-template.md
└── joao-silva.md           ← SEU ADR (NO SEU FORK)
```

Nome do arquivo: `<seu-nome-em-kebab>.md` (ex: `joao-silva.md`). Se for múltiplos arquivos (código + screencast + relatório), use diretório: `joao-silva/`.

### 5. Commits limpos

```bash
git add exercicios/01-casos-de-teste-funcionais/joao-silva.md
git commit -m "entrega: atividade 1 casos de teste - João Silva"
```

Mensagem boa: começa com `entrega:` ou `feat:`, descreve o que foi entregue. **Não comite arquivos gerados** (`node_modules/`, `.expo/`, `build/`).

### 6. Push pro seu fork

```bash
git push origin entrega/atividade-1-joao-silva
```

### 7. Submeter no Canvas

No Canvas, abra **Atividade Objetiva N** → **Iniciar tarefa** → cole o link da entrega.

**O que colar como link:**
- **Opção A** (recomendado): link do commit
  - `https://github.com/SEU-USUARIO/puc-iec-mobile-multiplataforma/commit/<sha>`
- **Opção B**: link do arquivo na branch
  - Arquitetura: `https://github.com/SEU-USUARIO/puc-iec-mobile-multiplataforma/blob/entrega/atividade-1-joao-silva/exercicios/01-adr-arquitetural/entregas/joao-silva.md`
  - Testes: `https://github.com/SEU-USUARIO/puc-iec-testes-aplicacoes-mobile/blob/entrega/atividade-1-joao-silva/exercicios/01-casos-de-teste-funcionais/entregas/joao-silva.md`
- **Opção C** (opcional): abrir Pull Request pro repo do professor e colar link do PR — bom pra review pública e portfólio

Pode anexar PDF/screencast direto no submit do Canvas também (não substitui o link GitHub).

---

## Tipos de entrega por atividade

| Tipo | Como entregar |
|---|---|
| **ADR / relatório markdown** | `.md` na pasta da atividade, link do commit no Canvas |
| **Código React Native / Flutter / nativo** | Diretório dentro da pasta da atividade com `README.md` explicando como rodar + screenshot/screencast |
| **Suíte de testes (Espresso / XCUITest / Maestro)** | Repo com testes + screenshot do CI verde (ou relatório local) |
| **Screencast (demo de app)** | Upload em Loom ou YouTube **unlisted** (não público), cole link no `README.md` da entrega |
| **Relatório técnico (performance / security)** | PDF ou markdown na pasta da atividade |

> Screencast de até 5min é o suficiente — mostre o golden path + 1-2 edge cases.

---

## FAQ

### Não tenho conta GitHub

Crie agora. <https://github.com/signup> — 2 minutos. Vai usar pela carreira toda.

### `git push` pede senha e diz "Authentication failed"

Senha de conta GitHub não funciona mais em `git push` (HTTPS) desde 2021. Use **Personal Access Token** (passo 4 dos pré-requisitos).

### Cometi erro no commit, dá pra reescrever?

```bash
git commit --amend            # corrige o último commit (só antes de pushear)
git push --force-with-lease   # se já pusheou — pra sua branch, não pra main
```

### Meu arquivo é muito grande (vídeo, build)

GitHub limita a **100MB por arquivo**, **2GB por repo**. Pra screencast use Loom/YouTube (link no README). Pra builds (.ipa, .apk), use GitHub Releases ou não comite — entregue rodando.

### Vou trabalhar em equipe (projeto final)

1 pessoa cria fork
2. Adiciona os outros como collaborators (Settings → Collaborators)
3. Cada um trabalha em branch própria
4. Mergeia tudo numa branch `entrega/projeto-final` antes do prazo
5. Link do commit final no Canvas (cada aluno submete o **mesmo link**)

### Posso entregar em PRIVATE repo?

Não. Política da disciplina: entregas em **repos públicos** ou em forks do repo público da disciplina. Isso facilita review entre alunos e cria portfólio público pra vocês.

### Esqueci o prazo, dá pra entregar atrasado?

Política do plano de ensino: **-10% por dia, máximo 3 dias**. Após isso, zero. 1 prorrogação por aluno por disciplina sem penalidade, mediante e-mail **antes** do prazo.

### Posso usar IA pra fazer a atividade?

Pode usar IA pra **assistir** — Cursor, Claude Code, Copilot. **Não pode terceirizar** raciocínio crítico. Em ADR, matriz de decisão, análise de gaps, escolha de stack: você tem que entender e defender. Se na arguição não souber justificar, perde a nota.

---

## Cheat sheet — comandos essenciais

```bash
# fork pelo navegador (passo 1)

# clonar fork local
git clone https://github.com/SEU-USUARIO/<repo>.git
cd <repo>

# manter sincronizado com o upstream do professor (opcional)
git remote add upstream https://github.com/jacksonsmith/<repo>.git
git fetch upstream
git merge upstream/main

# trabalhar
git checkout -b entrega/atividade-N-seu-nome
# editar arquivos em exercicios/<atividade>/
git add exercicios/<atividade>/seu-arquivo.md
git commit -m "entrega: descricao curta"
git push origin entrega/atividade-N-seu-nome

# pegar link do commit pra colar no Canvas
git log -1 --format="%H"   # SHA do último commit
# link = https://github.com/SEU-USUARIO/<repo>/commit/<SHA>
```

---

**Dúvidas?** Canal Teams da disciplina ou e-mail [jackson.96@gmail.com](mailto:jackson.96@gmail.com). Workflow é padrão de mercado — fica bom no LinkedIn também.
