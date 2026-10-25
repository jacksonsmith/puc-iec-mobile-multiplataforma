// __tests__/format.test.ts

import { formatRating, formatRuntime, releaseYear } from '../src/utils/format';

describe('format', () => {
  test('releaseYear extrai o ano e rejeita datas vazias', () => {
    expect(releaseYear('2026-07-15')).toBe('2026');
    expect(releaseYear('')).toBeNull();
    expect(releaseYear(undefined)).toBeNull();
  });

  test('formatRuntime converte minutos em horas e minutos', () => {
    expect(formatRuntime(172)).toBe('2h 52min');
    expect(formatRuntime(120)).toBe('2h');
    expect(formatRuntime(45)).toBe('45min');
    expect(formatRuntime(0)).toBeNull();
    expect(formatRuntime(null)).toBeNull();
  });

  test('formatRating usa uma casa decimal com vírgula', () => {
    expect(formatRating(7.856)).toBe('7,9');
    expect(formatRating(8)).toBe('8,0');
  });
});
