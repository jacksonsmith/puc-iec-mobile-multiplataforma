export interface Criterion {
  key: string
  label: string
  weight: number
  earned: number
  manual?: boolean
  note?: string
  privateNote?: string
}

export interface GradeResult {
  autoScore: number
  maxAutoScore: number
  totalScore: number
  maxTotalScore: number
  criteria: Criterion[]
  breakdown: string
  privateBreakdown: string
}

export function computeScore(criteria: Criterion[]): number {
  return criteria.reduce((sum, c) => sum + c.earned, 0)
}

export function computeAuto(criteria: Criterion[]): number {
  return criteria.filter(c => !c.manual).reduce((sum, c) => sum + c.earned, 0)
}

export function buildBreakdowns(criteria: Criterion[]): { pub: string; priv: string } {
  const lines = criteria.map(c => {
    const icon = c.earned >= c.weight ? '✅' : c.earned > 0 ? '⚠️' : '❌'
    const manual = c.manual ? ' 📝' : ''
    const note = c.note ? ` — ${c.note}` : ''
    return `${icon} ${c.label}${manual}: **${c.earned}/${c.weight}**${note}`
  })

  const privLines = criteria.map(c => {
    const icon = c.earned >= c.weight ? '✅' : c.earned > 0 ? '⚠️' : '❌'
    const manual = c.manual ? ' 📝' : ''
    const note = c.privateNote ? ` — ${c.privateNote}` : c.note ? ` — ${c.note}` : ''
    return `${icon} ${c.label}${manual}: ${c.earned}/${c.weight}${note}`
  })

  return { pub: lines.join('\n'), priv: privLines.join('\n') }
}
