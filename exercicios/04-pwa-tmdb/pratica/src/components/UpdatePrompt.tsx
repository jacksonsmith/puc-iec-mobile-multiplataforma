import { useRegisterSW } from 'virtual:pwa-register/react';

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
    <aside role="status" aria-live="polite" style={{
      position: 'fixed', bottom: 88, left: 16, right: 16, maxWidth: 480,
      margin: '0 auto', padding: 16, borderRadius: 12, zIndex: 100,
      background: '#0d253f', color: '#fff', border: '1px solid #01b4e4',
      boxShadow: '0 4px 20px #0008',
    }}>
      <p>{needRefresh ? 'Nova versão disponível' : 'App pronto para uso offline'}</p>
      {needRefresh && (
        <button type="button" onClick={() => void updateServiceWorker(true)}>
          Atualizar
        </button>
      )}
      <button type="button" onClick={dismiss} style={{ marginLeft: 12 }}>
        {needRefresh ? 'Depois' : 'Fechar'}
      </button>
    </aside>
  );
}
