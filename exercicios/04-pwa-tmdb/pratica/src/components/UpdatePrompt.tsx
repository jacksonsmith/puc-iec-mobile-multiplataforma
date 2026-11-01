import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  return (
    <aside role="status" style={{
      position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 10,
      padding: 16, background: '#1c3a52', color: '#fff', borderRadius: 10,
    }}>
      {needRefresh ? (
        <>
          <p>Nova versão disponível</p>
          <button onClick={() => updateServiceWorker(true)}>Atualizar</button>{' '}
          <button onClick={() => setNeedRefresh(false)}>Depois</button>
        </>
      ) : (
        <>
          <p>App pronto para uso offline</p>
          <button onClick={() => setOfflineReady(false)}>Fechar</button>
        </>
      )}
    </aside>
  );
}
