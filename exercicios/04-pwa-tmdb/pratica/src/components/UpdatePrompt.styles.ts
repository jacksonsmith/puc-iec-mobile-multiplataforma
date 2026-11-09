import type React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  toast: {
    position: 'fixed',
    left: 16,
    right: 16,
    bottom: 80, // acima da BottomTabBar
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#0d253f',
    color: '#fff',
    border: '1px solid #01b4e4',
    borderRadius: 8,
    padding: '10px 14px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    fontSize: 14,
  },
  message: {
    flex: 1,
  },
  primaryBtn: {
    background: '#01b4e4',
    color: '#0d253f',
    border: 'none',
    borderRadius: 6,
    padding: '6px 12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid #ffffff66',
    borderRadius: 6,
    padding: '6px 12px',
    cursor: 'pointer',
  },
};
