// src/services/api.ts
//
// CAMADA SERVICES — somente comunicação HTTP.
// Não conhece cache, não conhece estado da aplicação.
//
// "Como falar com o backend"
//
// Doc axios: https://axios-http.com/
// Token TMDB: gerar em https://www.themoviedb.org/settings/api

import axios from 'axios';

const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

export const isTokenMissing = (() => {
  if (!TOKEN) return true;
  const t = TOKEN.trim();
  if (t.length < 20) return true;
  if (t === 'cole_seu_token_aqui') return true;
  if (t.startsWith('dummy')) return true;
  return false;
})();

const isV4Token = TOKEN ? TOKEN.startsWith('eyJ') : false;

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (isTokenMissing) {
    return Promise.reject(
      new Error('TMDB_TOKEN_MISSING: configure EXPO_PUBLIC_TMDB_TOKEN no .env')
    );
  }
  const baseParams = { language: 'pt-BR', ...(config.params || {}) };
  if (isV4Token) {
    config.headers.Authorization = `Bearer ${TOKEN}`;
    config.params = baseParams;
  } else {
    config.params = { ...baseParams, api_key: TOKEN };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 || err?.message?.startsWith?.('TMDB_TOKEN_MISSING')) {
      err.isTokenError = true;
    }
    console.warn('[api] erro:', err?.response?.status ?? err?.message, err?.config?.url);
    return Promise.reject(err);
  }
);

export const isTokenError = (error: unknown): boolean => {
  if (!error) return false;
  const e = error as { isTokenError?: boolean; response?: { status?: number }; message?: string };
  if (e.isTokenError) return true;
  if (e.response?.status === 401) return true;
  if (e.message?.startsWith?.('TMDB_TOKEN_MISSING')) return true;
  return false;
};
