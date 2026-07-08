import type React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    gap: 16,
    padding: 16,
    borderRadius: 14,
    background: '#1c2d40',
    marginBottom: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
  },
  poster: { borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  title: { margin: '0 0 4px', color: '#01b4e4', fontSize: 16 },
  meta: { margin: '0 0 6px', color: '#90a4ae', fontSize: 13 },
  overview: { margin: '0 0 10px', color: '#cfd8dc', fontSize: 13, lineHeight: 1.5 },
  actions: { display: 'flex', gap: 8 },
  btn: {
    borderRadius: 4,
    padding: '5px 12px',
    fontSize: 12,
    cursor: 'pointer',
    color: '#e5e5e5',
    background: '#1c2d40',
  },
};
