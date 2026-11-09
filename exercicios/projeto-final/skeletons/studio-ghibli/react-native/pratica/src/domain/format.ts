const HIGH_SCORE_THRESHOLD = 90;

export function formatFilmCount(count: number): string {
  return count === 1 ? '1 filme' : `${count} filmes`;
}

export function formatRuntime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}min`;

  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
}

export function formatScore(score: number): string {
  return `${score}%`;
}

export function isHighScore(score: number): boolean {
  return score >= HIGH_SCORE_THRESHOLD;
}
