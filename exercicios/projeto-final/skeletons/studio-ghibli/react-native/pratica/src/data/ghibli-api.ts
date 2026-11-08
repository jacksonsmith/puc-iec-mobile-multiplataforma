import type { Film } from '@/domain/film';

import { mapFilm, type FilmDto } from './mappers';

const BASE_URL = 'https://ghibliapi.vercel.app';
const REQUEST_TIMEOUT_MS = 10_000;

export class GhibliApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GhibliApiError';
    this.status = status;
  }
}

async function requestJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abortRequest = () => controller.abort();
  signal?.addEventListener('abort', abortRequest);

  try {
    const response = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });

    if (!response.ok) {
      throw new GhibliApiError(`A API respondeu com status ${response.status}`, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof GhibliApiError) throw error;
    throw new GhibliApiError('Não foi possível conectar à API');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortRequest);
  }
}

export async function fetchFilms(signal?: AbortSignal): Promise<Film[]> {
  const films = await requestJson<FilmDto[]>('/films', signal);

  return films.map(mapFilm);
}
