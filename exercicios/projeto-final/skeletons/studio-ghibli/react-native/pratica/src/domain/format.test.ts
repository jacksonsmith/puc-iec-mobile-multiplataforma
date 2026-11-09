import { describe, expect, it } from 'vitest';

import { formatFilmCount, formatRuntime, formatScore, isHighScore } from './format';

describe('formatRuntime', () => {
  it('formata horas e minutos', () => {
    expect(formatRuntime(125)).toBe('2h 5min');
  });

  it('omite as horas em filmes com menos de 1 hora', () => {
    expect(formatRuntime(45)).toBe('45min');
  });

  it('omite os minutos em horas exatas', () => {
    expect(formatRuntime(120)).toBe('2h');
  });
});

describe('formatScore', () => {
  it('mostra a nota em porcentagem', () => {
    expect(formatScore(97)).toBe('97%');
  });
});

describe('isHighScore', () => {
  it('considera alta a nota a partir de 90', () => {
    expect(isHighScore(90)).toBe(true);
    expect(isHighScore(89)).toBe(false);
  });
});

describe('formatFilmCount', () => {
  it('usa o singular para 1 filme', () => {
    expect(formatFilmCount(1)).toBe('1 filme');
    expect(formatFilmCount(3)).toBe('3 filmes');
  });
});
