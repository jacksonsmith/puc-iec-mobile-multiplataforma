export interface PokemonSummary {
  id: number;
  name: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  heightDm: number;
  weightHg: number;
}

export function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function idFromUrl(url: string): number {
  const segments = url.split('/').filter(Boolean);
  return Number(segments[segments.length - 1]);
}

export function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}
