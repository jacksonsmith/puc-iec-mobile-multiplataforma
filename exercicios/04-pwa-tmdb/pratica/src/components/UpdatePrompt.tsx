import type React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const promptStyle: React.CSSProperties = {
  position: 'fixed',
  right: 16,
  bottom: 80,
  zIndex: 110,
  maxWidth: 360,
  padding: 16,
  borderRadius: 12,
  background: '#1c2d40',
  color: '#fff',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
};

const buttonStyle: React.CSSProperties = {
  marginTop: 12,
  padding: '8px 12px',
  border: 0,
  borderRadius: 8,
  background: '#01b4e4',
  color: '#0d253f',
  fontWeight: 700,
  cursor: 'pointer',
};

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  const dismiss = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <aside style={promptStyle} role="status">
      {needRefresh ? (
        <>
          <div>Uma nova versão está disponível.</div>
          <button type="button" style={buttonStyle} onClick={() => updateServiceWorker(true)}>
            Atualizar agora
          </button>
        </>
      ) : (
        <div>Aplicativo pronto para funcionar offline.</div>
      )}
      <button type="button" style={buttonStyle} onClick={dismiss}>
        Fechar
      </button>
    </aside>
  );
}
