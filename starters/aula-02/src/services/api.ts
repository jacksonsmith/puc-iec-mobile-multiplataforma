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

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
});

// Interceptor: adiciona Bearer token em toda request
api.interceptors.request.use((config) => {
  const token = process.env.EXPO_PUBLIC_TMDB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.params = { language: 'pt-BR', ...(config.params || {}) };
  return config;
});

// Interceptor: log de erro centralizado
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.warn('[api] erro:', err?.response?.status, err?.config?.url);
    return Promise.reject(err);
  }
);
