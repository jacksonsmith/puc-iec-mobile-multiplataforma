import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  function dismiss() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (
    <aside role="status" style={{ padding: 16, background: '#0d253f', color: '#fff' }}>
      <p>{needRefresh ? 'Nova versão disponível' : 'App pronto para uso offline'}</p>
      {needRefresh && (
        <button type="button" onClick={() => void updateServiceWorker(true)}>Atualizar</button>
      )}
      <button type="button" onClick={dismiss}>{needRefresh ? 'Depois' : 'Dispensar'}</button>
    </aside>
  );
}
