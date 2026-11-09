export function isFavorite(favoriteIds: string[], filmId: string): boolean {
  return favoriteIds.includes(filmId);
}

/** Adiciona no início, para o favorito mais recente aparecer primeiro, ou remove se já existir. */
export function toggleFavorite(favoriteIds: string[], filmId: string): string[] {
  return isFavorite(favoriteIds, filmId)
    ? favoriteIds.filter((id) => id !== filmId)
    : [filmId, ...favoriteIds];
}
