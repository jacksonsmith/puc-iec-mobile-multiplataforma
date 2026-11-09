import type { ReactNode } from 'react';

type FilmDetailFrameProps = {
  children: ReactNode;
  onClose: () => void;
};

export function FilmDetailFrame({ children }: FilmDetailFrameProps) {
  return children;
}
