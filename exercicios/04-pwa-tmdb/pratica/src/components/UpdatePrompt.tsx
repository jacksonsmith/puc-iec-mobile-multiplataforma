import { useRegisterSW } from 'virtual:pwa-register/react';

const promptStyle: React.CSSProperties = {
  position: 'fixed',
  right: 16,
  bottom: 72,
  left: 16,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 16px',
  borderRadius: 10,
  background: '#01b4e4',
  color: '#0d253f',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  fontSize: 14,
  fontWeight: 600,
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 6,
  padding: '6px 12px',
  background: '#0d253f',
  color: '#01b4e4',
  cursor: 'pointer',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const closePrompt = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div role="status" style={promptStyle}>
      {offlineReady ? (
        <span>O app está pronto para uso offline.</span>
      ) : (
        <>
          <span>Uma nova versão está disponível.</span>
          <span>
            <button onClick={() => updateServiceWorker(true)} style={buttonStyle}>
              Atualizar
            </button>{' '}
            <button onClick={closePrompt} style={buttonStyle}>
              Agora não
            </button>
          </span>
        </>
      )}
      {offlineReady && (
        <button onClick={closePrompt} style={buttonStyle}>
          Fechar
        </button>
      )}
    </div>
  );
}
