import type React from 'react';

// Aviso fixo no topo: no celular o rodapé é da BottomTabBar (z-index 100).
export const styles: Record<string, React.CSSProperties> = {
  toast: {
    position: 'fixed',
    top: 12,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(92vw, 480px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '10px 14px',
    background: '#1c2d40',
    color: '#e0e0e0',
    border: '1px solid #01b4e4',
    borderRadius: 10,
    boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    fontSize: 14,
    zIndex: 200,
  },
  actions: { display: 'flex', gap: 8, flexShrink: 0 },
  primary: {
    background: '#01b4e4',
    color: '#0d253f',
    border: 'none',
    borderRadius: 6,
    padding: '6px 12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondary: {
    background: 'none',
    color: '#90a4ae',
    border: '1px solid #2a3f55',
    borderRadius: 6,
    padding: '6px 12px',
    cursor: 'pointer',
  },
};
