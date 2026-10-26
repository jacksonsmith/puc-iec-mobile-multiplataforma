import type React from 'react';

const button: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
};

export const styles: Record<string, React.CSSProperties> = {
  toast: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '12px 14px 12px 16px',
    borderRadius: 12,
    background: '#112233',
    border: '1px solid #1e3a52',
    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
    color: '#e0e0e0',
    zIndex: 200,
  },
  message: { fontSize: 14, fontWeight: 600 },
  actions: { display: 'flex', gap: 8, flexShrink: 0 },
  primary: { ...button, background: '#01b4e4', color: '#0d253f' },
  secondary: { ...button, background: 'transparent', color: '#90a4ae' },
};
