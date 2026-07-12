import { FilmDetail, FilmSummary } from '../types/film';

const BASE_URL = 'https://ghibliapi.vercel.app';

export async function fetchList(): Promise<FilmSummary[]> {
  const res = await fetch(`${BASE_URL}/films`);
  if (!res.ok) throw new Error('Falha ao carregar lista de filmes');
  const body = await res.json();
  return body.map((entry: { id: string; title: string }) => ({
    id: entry.id,
    title: entry.title,
  }));
}

export async function fetchDetail(id: string): Promise<FilmDetail> {
  const res = await fetch(`${BASE_URL}/films/${id}`);
  if (!res.ok) throw new Error(`Falha ao carregar detalhe do filme ${id}`);
  return res.json();
}

// A própria API filtra por diretor — sem precisar de endpoint separado de
// "categoria" como o PokeAPI.
export async function fetchTitlesByDirector(director: string): Promise<Set<string>> {
  const res = await fetch(`${BASE_URL}/films?director=${encodeURIComponent(director)}`);
  if (!res.ok) throw new Error(`Falha ao carregar diretor ${director}`);
  const body = await res.json();
  return new Set(body.map((entry: { title: string }) => entry.title));
}
