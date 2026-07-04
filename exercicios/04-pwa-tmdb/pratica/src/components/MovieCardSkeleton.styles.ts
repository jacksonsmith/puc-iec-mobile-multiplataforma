import type React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    gap: 16,
    padding: 16,
    borderRadius: 8,
    background: '#1c2d40',
    marginBottom: 12,
  },
  info: { flex: 1, minWidth: 0 },
  shimmer: {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #1c2d40 25%, #2a3f55 50%, #1c2d40 75%)',
    backgroundSize: '800px 100%',
    animation: 'shimmer 1.4s infinite linear',
  },
};
