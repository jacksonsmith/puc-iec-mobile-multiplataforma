import type { Film } from './film';
import { normalize } from './filter';

export type Director = {
  name: string;
  slug: string;
  count: number;
};

function toSlugWords(name: string): string[] {
  return normalize(name).split(/\s+/);
}

/** Usa só o sobrenome, a não ser que outro diretor tenha o mesmo: aí usa o nome completo. */
export function slugify(name: string, allNames: string[] = [name]): string {
  const words = toSlugWords(name);
  const lastName = words.at(-1);
  const isLastNameShared =
    allNames.filter((otherName) => toSlugWords(otherName).at(-1) === lastName).length > 1;

  return isLastNameShared ? words.join('-') : (lastName ?? '');
}

export function getDirectors(films: Film[]): Director[] {
  const counts = new Map<string, number>();
  films.forEach((film) => counts.set(film.director, (counts.get(film.director) ?? 0) + 1));
  const names = [...counts.keys()];

  return names
    .map((name) => ({ name, slug: slugify(name, names), count: counts.get(name) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
