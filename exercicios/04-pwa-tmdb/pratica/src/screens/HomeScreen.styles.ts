import type React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: 720, margin: '0 auto', padding: '0 16px 40px' },
  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 14px',
    borderRadius: 6,
    border: '1px solid #2a3f55',
    background: '#1c2d40',
    color: '#e5e5e5',
    fontSize: 14,
    marginBottom: 16,
    outline: 'none',
  },
  offlineBanner: {
    background: '#C2410C',
    color: '#fff',
    padding: '8px 16px',
    textAlign: 'center',
    fontSize: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyState: { color: '#90a4ae', textAlign: 'center', padding: '40px 0', fontSize: 15 },
};
