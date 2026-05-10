/**
 * Tipo canônico do resultado do autograder.
 * Cada validator gera GradeResult e escreve em grade.json.
 */
export interface GradeCriterion {
  id: string;
  description: string;
  weight: number; // pontos do critério
  earned: number; // ponto obtido (0..weight)
  publicNote?: string; // nota visível no comment do PR
  privateNote?: string; // detalhe só no artifact
}

export interface GradeResult {
  atividade: string;
  total: number; // soma de pesos
  score: number; // soma de earned
  minimo: number; // pontuação mínima pra status check verde
  pass: boolean;
  criteria: GradeCriterion[];
  publicBreakdown: string; // markdown pro comment
  privateBreakdown: string; // markdown pro artifact
  metadata: {
    studentLogin: string;
    entregaPath: string;
    timestamp: string;
    commitSha: string;
  };
}

export function computeScore(criteria: GradeCriterion[]): {
  total: number;
  score: number;
} {
  const total = criteria.reduce((acc, c) => acc + c.weight, 0);
  const score = criteria.reduce((acc, c) => acc + c.earned, 0);
  return { total, score };
}

export function buildBreakdowns(criteria: GradeCriterion[]): {
  publicBreakdown: string;
  privateBreakdown: string;
} {
  const publicLines = criteria.map((c) => {
    const status = c.earned === c.weight ? '✅' : c.earned > 0 ? '⚠️' : '❌';
    const note = c.publicNote ? ` — ${c.publicNote}` : '';
    return `- ${status} **${c.description}** (${c.earned}/${c.weight})${note}`;
  });

  const privateLines = criteria.map((c) => {
    const status = c.earned === c.weight ? '✅' : c.earned > 0 ? '⚠️' : '❌';
    const pub = c.publicNote ? `\n  - Público: ${c.publicNote}` : '';
    const prv = c.privateNote ? `\n  - Privado: ${c.privateNote}` : '';
    return `- ${status} **${c.description}** (${c.earned}/${c.weight})${pub}${prv}`;
  });

  return {
    publicBreakdown: publicLines.join('\n'),
    privateBreakdown: privateLines.join('\n'),
  };
}

export function passThreshold(total: number, percentMin = 60): number {
  return Math.ceil((total * percentMin) / 100);
}
