// src/components/UpdatePrompt.tsx
// Avisos do Service Worker (registerType: 'prompt'):
//   - offlineReady → app cacheado, já funciona offline
//   - needRefresh  → nova versão em "waiting"; o usuário decide quando ativar

import { useRegisterSW } from 'virtual:pwa-register/react';

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  left: 16,
  right: 16,
  bottom: 84, // acima da BottomTabBar
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  maxWidth: 560,
  margin: '0 auto',
  padding: '12px 16px',
  background: '#1c3a52',
  color: '#e5e5e5',
  borderRadius: 10,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
  fontSize: 14,
};

const primaryBtnStyle: React.CSSProperties = {
  background: '#01b4e4',
  color: '#0d253f',
  border: 'none',
  borderRadius: 6,
  padding: '6px 14px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 13,
  whiteSpace: 'nowrap',
};

const secondaryBtnStyle: React.CSSProperties = {
  ...primaryBtnStyle,
  background: 'transparent',
  color: '#90cae4',
  border: '1px solid #2a3f55',
};

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (needRefresh) {
    return (
      <div role="alert" style={toastStyle}>
        <span>🔄 Nova versão disponível</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => updateServiceWorker(true)} style={primaryBtnStyle}>
            Atualizar
          </button>
          <button onClick={() => setNeedRefresh(false)} style={secondaryBtnStyle}>
            Depois
          </button>
        </div>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div role="status" style={toastStyle}>
        <span>✅ App pronto para uso offline</span>
        <button onClick={() => setOfflineReady(false)} style={secondaryBtnStyle}>
          OK
        </button>
      </div>
    );
  }

  return null;
}
