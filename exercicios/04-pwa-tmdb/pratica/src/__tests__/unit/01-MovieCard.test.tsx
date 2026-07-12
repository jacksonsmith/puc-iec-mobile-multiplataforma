// src/__tests__/MovieCard.test.tsx
// 📘 MODELO — leia antes de escrever os outros testes

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovieCard } from '../../components/MovieCard';
import type { Movie } from '../../types/movie';

const movie: Movie = {
  id: 1,
  title: 'Matrix',
  overview: 'Neo descobre que a realidade é uma simulação.',
  poster_path: '/matrix.jpg',
  release_date: '1999-03-31',
  vote_average: 8.7,
};

describe('MovieCard', () => {
  it('1. renderiza título e nota do filme', () => {
    render(
      <MovieCard movie={movie} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('Matrix')).toBeInTheDocument();
    expect(screen.getByText(/8\.7/)).toBeInTheDocument();
  });

  it('2. botão "Favoritar" chama onToggleFavorite com o id do filme', async () => {
    const onToggle = vi.fn();
    render(
      <MovieCard movie={movie} isFavorite={false} onToggleFavorite={onToggle} />
    );
    await userEvent.click(screen.getByRole('button', { name: /favoritar/i }));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('3. quando isFavorite=true, botão mostra "★ Favorito"', () => {
    render(
      <MovieCard movie={movie} isFavorite={true} onToggleFavorite={() => {}} />
    );
    expect(screen.getByRole('button', { name: /remover favorito/i })).toHaveTextContent('★ Favorito');
  });

  // ── TODO (bônus) ──────────────────────────────────────────────────────────
  // it('4. exibe apenas os primeiros 120 caracteres do overview', () => { ... })
  // ─────────────────────────────────────────────────────────────────────────
});
