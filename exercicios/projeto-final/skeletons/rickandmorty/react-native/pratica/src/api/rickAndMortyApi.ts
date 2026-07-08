import { CharacterDetail, CharacterSummary } from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

export async function fetchList(page = 1): Promise<CharacterSummary[]> {
  const res = await fetch(`${BASE_URL}/character?page=${page}`);
  if (!res.ok) throw new Error('Falha ao carregar lista de personagens');
  const body = await res.json();
  return body.results.map((entry: { id: number; name: string }) => ({
    id: entry.id,
    name: entry.name,
  }));
}

export async function fetchDetail(id: number): Promise<CharacterDetail> {
  const res = await fetch(`${BASE_URL}/character/${id}`);
  if (!res.ok) throw new Error(`Falha ao carregar detalhe do personagem ${id}`);
  return res.json();
}

// A própria API filtra por status — sem precisar de endpoint separado de
// "tipo" como o PokeAPI.
export async function fetchNamesByStatus(status: string): Promise<Set<string>> {
  const res = await fetch(`${BASE_URL}/character/?status=${status}`);
  if (!res.ok) throw new Error(`Falha ao carregar status ${status}`);
  const body = await res.json();
  return new Set(body.results.map((entry: { name: string }) => entry.name));
}
