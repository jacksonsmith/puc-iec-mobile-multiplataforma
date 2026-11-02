/// <reference types="vite-plugin-pwa/react" />

import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
  const [isOfflineReady, setOfflineReady] = offlineReady;
  const [isUpdateAvailable, setNeedRefresh] = needRefresh;

  if (!isOfflineReady && !isUpdateAvailable) return null;

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 80,
        zIndex: 10,
        maxWidth: 320,
        padding: 16,
        borderRadius: 12,
        background: '#1c2d40',
        color: '#e5e5e5',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      }}
    >
      {isUpdateAvailable ? (
        <>
          <p style={{ margin: '0 0 12px' }}>Nova versão disponível.</p>
          <button type="button" onClick={() => void updateServiceWorker(true)}>
            Atualizar
          </button>
          <button type="button" onClick={() => setNeedRefresh(false)}>
            Depois
          </button>
        </>
      ) : (
        <>
          <p style={{ margin: '0 0 12px' }}>App pronto para uso offline.</p>
          <button type="button" onClick={() => setOfflineReady(false)}>
            Dispensar
          </button>
        </>
      )}
    </div>
  );
}
