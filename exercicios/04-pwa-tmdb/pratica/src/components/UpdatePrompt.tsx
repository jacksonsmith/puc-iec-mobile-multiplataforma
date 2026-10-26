// src/components/UpdatePrompt.tsx
// Avisos do ciclo de vida do Service Worker (registerType: 'prompt'):
// "pronto para uso offline" na 1ª instalação e "nova versão" quando há um SW em waiting.
// Só aparece no build (npm run build && npm run preview); no dev o SW não é registrado.

import { useRegisterSW } from 'virtual:pwa-register/react';

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  left: 16,
  right: 16,
  bottom: 80, // acima da BottomTabBar (64px) no mobile
  maxWidth: 480,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 16px',
  background: '#1c3a52',
  color: '#e5e5e5',
  borderRadius: 10,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
  fontSize: 14,
  fontWeight: 600,
  zIndex: 200,
};

const btnStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 6,
  padding: '6px 14px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 13,
  whiteSpace: 'nowrap',
};

const primaryBtnStyle: React.CSSProperties = { ...btnStyle, background: '#01b4e4', color: '#0d253f' };
const secondaryBtnStyle: React.CSSProperties = { ...btnStyle, background: 'transparent', color: '#90cae4' };

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  // Nova versão tem prioridade: é o aviso que pede uma decisão do usuário
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
