import { describe, expect, it } from 'vitest';

import { isFavorite, toggleFavorite } from './favorites';

describe('toggleFavorite', () => {
  it('adiciona o favorito mais recente primeiro', () => {
    expect(toggleFavorite(['a'], 'b')).toEqual(['b', 'a']);
  });

  it('remove um favorito existente mantendo a ordem', () => {
    expect(toggleFavorite(['c', 'b', 'a'], 'b')).toEqual(['c', 'a']);
  });

  it('não duplica ao favoritar, desfavoritar e favoritar de novo', () => {
    const added = toggleFavorite([], 'a');
    const removed = toggleFavorite(added, 'a');

    expect(toggleFavorite(removed, 'a')).toEqual(['a']);
  });
});

describe('isFavorite', () => {
  it('indica se o filme está nos favoritos', () => {
    expect(isFavorite(['a'], 'a')).toBe(true);
    expect(isFavorite(['a'], 'b')).toBe(false);
  });
});
