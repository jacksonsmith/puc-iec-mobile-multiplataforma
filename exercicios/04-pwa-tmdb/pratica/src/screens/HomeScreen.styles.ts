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
};
