import axios from 'axios';

export const isTokenMissing = !process.env.EXPO_PUBLIC_TMDB_TOKEN;

export const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 15000,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_TOKEN ?? ''}`,
    },
    params: { language: 'pt-BR' },
});
