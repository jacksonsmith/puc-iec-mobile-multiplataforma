import type { Criterion } from './compute-score.js';
import { FileCtx } from './fs-ctx.js';

// Um critério com (opcional) checagem automática. Sem `check` → avaliação manual (piso).
export type RubricCriterion = {
  key: string;
  label: string;
  weight: number;
  manual?: boolean;
  // Retorna pontos ganhos (0..weight) + nota. Só pra critérios automáticos.
  check?: (f: FileCtx) => { earned: number; note?: string; privateNote?: string };
};

export type Rubric = {
  task: string;
  track: 'eng' | 'qa';
  criteria: RubricCriterion[];
};

// ---------- builders ----------
const REPORT = (id: string) => `reports/${id}.md`;
const RESOLVERS = 'server/src/resolvers.ts';
const AUTH = 'server/src/auth.ts';
const SCHEMA = 'server/src/schema.ts';
const BASELINE_TEST = 'server/src/__tests__/resolvers.test.ts';

function manual(key: string, label: string, weight: number): RubricCriterion {
  return { key, label, weight, manual: true };
}

// Critério automático por regex: ganha tudo se todos `mustHave` baterem e nenhum `mustLack`.
function regexCheck(
  key: string,
  label: string,
  weight: number,
  rel: string,
  opts: { mustHave?: RegExp[]; mustLack?: RegExp[] },
): RubricCriterion {
  return {
    key,
    label,
    weight,
    check: (f) => {
      const src = f.read(rel);
      if (src == null) return { earned: 0, note: `arquivo ausente: ${rel}` };
      for (const re of opts.mustHave ?? [])
        if (!re.test(src)) return { earned: 0, note: `padrão esperado não encontrado em ${rel}` };
      for (const re of opts.mustLack ?? [])
        if (re.test(src)) return { earned: 0, note: `padrão proibido ainda presente em ${rel}` };
      return { earned: weight };
    },
  };
}

function reportExists(id: string, weight: number, label = 'relatório presente'): RubricCriterion {
  return {
    key: `${id}-report`,
    label,
    weight,
    check: (f) => {
      const ok = f.exists(REPORT(id));
      return ok ? { earned: weight } : { earned: 0, note: `crie ${REPORT(id)}` };
    },
  };
}

// "Aluno adicionou ao menos um teste novo" (qualquer *.test.* que não seja o baseline).
function testAdded(weight: number, label = 'teste de reprodução adicionado'): RubricCriterion {
  return {
    key: 'test-added',
    label,
    weight,
    check: (f) => {
      const tests = [
        ...f.list('server/src', '.test.ts'),
        ...f.list('apps', '.test.ts'),
        ...f.list('apps', '.test.tsx'),
      ].filter((p) => !p.endsWith('resolvers.test.ts'));
      return tests.length > 0
        ? { earned: weight, note: `${tests.length} arquivo(s) de teste` }
        : { earned: 0, note: 'nenhum teste novo encontrado' };
    },
  };
}

// Conta flows Maestro válidos (até `cap`): tem launchApp/appId + assertVisible + sem TODO.
function maestroFlows(weight: number, cap: number): RubricCriterion {
  return {
    key: 'flows',
    label: `${cap}+ flows Maestro válidos`,
    weight,
    check: (f) => {
      const flows = [...f.list('flows', '.yaml'), ...f.list('flows', '.yml')];
      let valid = 0;
      for (const p of flows) {
        const src = f.read(p.slice(f.root.length + 1)) ?? '';
        const ok =
          /(appId:|launchApp)/.test(src) && /assertVisible/.test(src) && !/TODO/i.test(src);
        if (ok) valid++;
      }
      const earned = Math.min(weight, valid);
      return { earned, note: `${valid} flow(s) válido(s)` };
    },
  };
}

// ---------- registry ----------
const RUBRICS: Rubric[] = [
  // ===== ENG — correções dos defeitos plantados (estrutural) =====
  {
    task: 'eng-sec-sqli',
    track: 'eng',
    criteria: [
      regexCheck('no-interp', 'sem interpolação de string na SQL', 2, RESOLVERS, {
        mustLack: [/LIKE\s*'%\$\{/],
      }),
      regexCheck('param', 'busca parametrizada (placeholder ?)', 2, RESOLVERS, {
        mustHave: [/LIKE \?/],
      }),
    ],
  },
  {
    task: 'eng-sec-jwt',
    track: 'eng',
    criteria: [
      regexCheck('verify', 'verifica assinatura (jwt.verify)', 3, AUTH, {
        mustHave: [/jwt\.verify\(/],
        mustLack: [/return\s+jwt\.decode\(/],
      }),
      regexCheck('reject', 'trata token inválido', 1, AUTH, { mustHave: [/catch/] }),
    ],
  },
  {
    task: 'eng-sec-secret',
    track: 'eng',
    criteria: [
      regexCheck('env', 'segredo lido do ambiente', 2, AUTH, {
        mustHave: [/process\.env\.JWT_SECRET/],
      }),
      regexCheck('no-literal', 'sem segredo hardcoded', 1, AUTH, { mustLack: [/sk_cinehub_/] }),
    ],
  },
  {
    task: 'eng-bug-pagination',
    track: 'eng',
    criteria: [
      regexCheck('ceil', 'totalPages com Math.ceil', 2, RESOLVERS, {
        mustHave: [/Math\.ceil\([^)]*total/],
      }),
    ],
  },
  {
    task: 'eng-bug-remove-favorite',
    track: 'eng',
    criteria: [
      regexCheck('user-scoped', 'remove só do próprio usuário', 3, RESOLVERS, {
        mustHave: [/DELETE FROM favorites WHERE user_id\s*=\s*\? AND movie_id/],
      }),
    ],
  },
  {
    task: 'eng-sec-authz',
    track: 'eng',
    criteria: [
      regexCheck('favorites', 'favoritesOf protegido por dono', 3, RESOLVERS, {
        // exige auth e compara o userId do contexto
        mustHave: [/favoritesOf[\s\S]{0,260}ctx\.userId/],
      }),
      regexCheck('list-owner', 'addMovieToList checa dono da lista', 2, RESOLVERS, {
        mustHave: [/owner_id[\s\S]{0,40}ctx\.userId|ctx\.userId[\s\S]{0,40}owner_id/],
      }),
      manual('adr', 'ADR justificando a regra de acesso', 1),
    ],
  },
  {
    task: 'eng-sec-login-hardening',
    track: 'eng',
    criteria: [
      regexCheck('single-msg', 'mensagem única (sem enumeração)', 2, RESOLVERS, {
        mustLack: [/E-mail n[ãa]o cadastrad/],
      }),
      manual('rate-limit', 'rate-limit por IP/e-mail', 3),
    ],
  },

  // ===== ENG — greenfield (existência automática + design manual) =====
  {
    task: 'eng-feat-graphql-pagination',
    track: 'eng',
    criteria: [
      regexCheck('schema', 'schema com cursor (edges/pageInfo)', 2, SCHEMA, {
        mustHave: [/pageInfo|endCursor|edges/i],
      }),
      manual('impl', 'cursor funcional (anda sem repetir/pular)', 4),
    ],
  },
  {
    task: 'eng-arch-clean-refactor',
    track: 'eng',
    criteria: [
      {
        key: 'adr-file',
        label: 'ADR presente',
        weight: 1,
        check: (f) => {
          const has =
            f.list('.', '.md').some((p) => /adr/i.test(p)) || f.exists('docs/ADR.md');
          return has ? { earned: 1 } : { earned: 0, note: 'sem arquivo ADR' };
        },
      },
      manual('layers', 'camadas/inversão de dependência + testes verdes', 7),
    ],
  },
  {
    task: 'eng-feat-native-module',
    track: 'eng',
    criteria: [
      {
        key: 'native-file',
        label: 'código nativo presente (Kotlin/Swift)',
        weight: 1,
        check: (f) => {
          const has =
            f.list('apps', '.kt').length > 0 ||
            f.list('apps', '.swift').length > 0 ||
            f.list('apps', '.java').length > 0;
          return has ? { earned: 1 } : { earned: 0, note: 'sem arquivo nativo' };
        },
      },
      manual('bridge', 'módulo exposto e consumido na UI', 7),
    ],
  },
  {
    task: 'eng-feat-pwa-offline',
    track: 'eng',
    criteria: [
      {
        key: 'sw',
        label: 'service worker presente',
        weight: 1,
        check: (f) => {
          const has = f
            .list('apps', '.ts')
            .concat(f.list('apps', '.js'))
            .some((p) => /service-?worker|\bsw\.(t|j)s$/i.test(p));
          return has ? { earned: 1 } : { earned: 0, note: 'sem service worker' };
        },
      },
      manual('offline', 'offline-first + Lighthouse ≥90 (relatório)', 7),
    ],
  },
  {
    task: 'eng-feat-oidc',
    track: 'eng',
    criteria: [
      {
        key: 'pkce',
        label: 'menção a PKCE/code_verifier',
        weight: 1,
        check: (f) => {
          const has = f
            .list('apps', '.ts')
            .concat(f.list('apps', '.tsx'))
            .some((p) => /pkce|code_verifier|code_challenge/i.test(f.read(p.slice(f.root.length + 1)) ?? ''));
          return has ? { earned: 1 } : { earned: 0, note: 'sem PKCE detectado' };
        },
      },
      manual('flow', 'fluxo OIDC+PKCE funcional', 7),
    ],
  },
  {
    task: 'eng-perf-optimize',
    track: 'eng',
    criteria: [reportExists('eng-perf', 1, 'relatório de performance'), manual('gain', 'ganho antes/depois com método', 5)],
  },
  {
    task: 'eng-ai-ondevice',
    track: 'eng',
    criteria: [reportExists('eng-ai', 1, 'nota técnica de IA on-device'), manual('infer', 'inferência local funcional', 7)],
  },

  // ===== QA — achados de bug/segurança (artefato automático + report manual) =====
  ...qaFinding('qa-sec-sqli', 6, 'SQL injection'),
  ...qaFinding('qa-sec-jwt', 6, 'falha de autenticação JWT'),
  ...qaFinding('qa-sec-idor', 6, 'acesso indevido (IDOR)'),
  {
    task: 'qa-sec-secret',
    track: 'qa',
    criteria: [reportExists('qa-sec-secret', 1), manual('evidence', 'evidência do scan + risco', 2)],
  },
  {
    task: 'qa-sec-enum',
    track: 'qa',
    criteria: [reportExists('qa-sec-enum', 1), manual('evidence', 'respostas distintas documentadas', 3)],
  },
  ...qaBug('qa-bug-pagination', 2),
  ...qaBug('qa-bug-search-empty', 2),
  {
    task: 'qa-bug-remove-favorite',
    track: 'qa',
    criteria: [testAdded(1, 'teste vermelho com 2 usuários'), manual('proof', 'prova o efeito entre usuários', 2)],
  },

  // ===== QA — greenfield =====
  {
    task: 'qa-unit-jest',
    track: 'qa',
    criteria: [testAdded(2, 'suíte unit adicionada'), manual('coverage', 'cobertura ≥70% no módulo', 4)],
  },
  {
    task: 'qa-maestro-e2e',
    track: 'qa',
    criteria: [maestroFlows(5, 5), manual('journey', 'jornada coerente + fragment', 1)],
  },
  {
    task: 'qa-perf-report',
    track: 'qa',
    criteria: [reportExists('qa-perf', 1), manual('metrics', '≥3 métricas com método', 4)],
  },
  {
    task: 'qa-visual-ai',
    track: 'qa',
    criteria: [
      {
        key: 'baseline',
        label: 'baseline visual presente',
        weight: 1,
        check: (f) => {
          const has =
            f.list('.', '.png').length > 0 || f.list('.', '.snap').length > 0 || f.exists('applitools.config.js');
          return has ? { earned: 1 } : { earned: 0, note: 'sem baseline visual' };
        },
      },
      manual('diff', 'diff detectado em 3 viewports', 4),
    ],
  },
  {
    task: 'qa-llm-testgen',
    track: 'qa',
    criteria: [reportExists('qa-llm-testgen', 1), manual('pipeline', 'pipeline ponta-a-ponta + reflexão', 6)],
  },
  {
    task: 'qa-ci-pipeline',
    track: 'qa',
    criteria: [
      {
        key: 'workflow',
        label: 'workflow com matrix presente',
        weight: 2,
        check: (f) => {
          const wfs = f.list('.github/workflows', '.yml').concat(f.list('.github/workflows', '.yaml'));
          const ok = wfs.some((p) => /matrix:/.test(f.read(p.slice(f.root.length + 1)) ?? ''));
          return ok ? { earned: 2 } : { earned: 0, note: 'sem workflow com matrix' };
        },
      },
      manual('gate', 'quality gate bloqueia merge', 3),
    ],
  },
  {
    task: 'qa-contract-graphql',
    track: 'qa',
    criteria: [testAdded(1, 'teste de contrato adicionado'), manual('schema', 'quebra de schema é detectada', 4)],
  },
  {
    task: 'qa-a11y',
    track: 'qa',
    criteria: [reportExists('qa-a11y', 1), manual('findings', '≥5 achados com referência WCAG/aria', 4)],
  },
];

// QA finding de segurança: PoC/teste (2) + report existe (1) + qualidade do report (3 manual).
function qaFinding(id: string, total: number, label: string): Rubric[] {
  return [
    {
      task: id,
      track: 'qa',
      criteria: [
        testAdded(2, `prova de conceito / teste (${label})`),
        reportExists(id, 1),
        manual('quality', 'qualidade do report (impacto + correção)', total - 3),
      ],
    },
  ];
}

// QA bug simples: teste vermelho existe (1 auto) + correto/vermelho (manual).
function qaBug(id: string, total: number): Rubric[] {
  return [
    {
      task: id,
      track: 'qa',
      criteria: [testAdded(1, 'teste de reprodução existe'), manual('red', 'é vermelho e descreve o esperado', total - 1)],
    },
  ];
}

export function getRubric(task: string): Rubric | undefined {
  return RUBRICS.find((r) => r.task === task);
}

export function allTasks(): { task: string; track: string; pts: number }[] {
  return RUBRICS.map((r) => ({
    task: r.task,
    track: r.track,
    pts: r.criteria.reduce((s, c) => s + c.weight, 0),
  }));
}

// Avalia uma rubrica contra a entrega; critérios `manual` entram com earned=0 (piso).
export function evaluate(rubric: Rubric, f: FileCtx): Criterion[] {
  return rubric.criteria.map((c) => {
    if (c.manual || !c.check) {
      return { key: c.key, label: c.label, weight: c.weight, earned: 0, manual: true };
    }
    const res = c.check(f);
    return {
      key: c.key,
      label: c.label,
      weight: c.weight,
      earned: res.earned,
      note: res.note,
      privateNote: res.privateNote,
    };
  });
}
