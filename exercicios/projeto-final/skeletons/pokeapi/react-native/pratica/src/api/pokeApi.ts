import { PokemonDetail, PokemonSummary, idFromUrl } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchList(limit = 151): Promise<PokemonSummary[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=0`);
  if (!res.ok) throw new Error('Falha ao carregar lista de pokémons');
  const body = await res.json();
  return body.results.map((entry: { name: string; url: string }) => ({
    id: idFromUrl(entry.url),
    name: entry.name,
  }));
}

export async function fetchDetail(id: number): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Falha ao carregar detalhe do pokémon ${id}`);
  const body = await res.json();
  return {
    id: body.id,
    name: body.name,
    types: body.types.map((t: { type: { name: string } }) => t.type.name),
    heightDm: body.height,
    weightHg: body.weight,
  };
}

export async function fetchNamesByType(type: string): Promise<Set<string>> {
  const res = await fetch(`${BASE_URL}/type/${type}`);
  if (!res.ok) throw new Error(`Falha ao carregar tipo ${type}`);
  const body = await res.json();
  return new Set(
    body.pokemon.map((entry: { pokemon: { name: string } }) => entry.pokemon.name),
  );
}
