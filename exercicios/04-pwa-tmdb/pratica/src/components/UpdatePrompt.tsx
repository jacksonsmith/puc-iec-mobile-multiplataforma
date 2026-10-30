// src/components/UpdatePrompt.tsx
// ✅ AVALIATIVO — TODO 3 (parte 2)
//
// Aviso do Service Worker (registerType: 'prompt'):
//   - offlineReady → 1ª instalação terminou de cachear o app ("já funciona offline")
//   - needRefresh  → build novo instalado e em "waiting"; só assume quando o usuário clicar Atualizar
// Sem aviso ativo, não renderiza nada.
// ⚠️ Só funciona no BUILD (npm run build && npm run preview): no npm run dev não há SW.

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
    <div role="alert" style={styles.toast}>
      {needRefresh ? (
        <>
          <span>🔄 Nova versão disponível</span>
          <div style={styles.actions}>
            <button onClick={() => updateServiceWorker(true)} style={{ ...styles.btn, ...styles.primary }}>
              Atualizar
            </button>
            <button onClick={() => setNeedRefresh(false)} style={styles.btn}>
              Depois
            </button>
          </div>
        </>
      ) : (
        <>
          <span>✅ App pronto para uso offline</span>
          <button onClick={dismiss} style={styles.btn}>
            OK
          </button>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  // bottom: 80 deixa o aviso acima da BottomTabBar (64px) no mobile
  toast: {
    position: 'fixed',
    left: 16,
    right: 16,
    bottom: 80,
    maxWidth: 480,
    margin: '0 auto',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '12px 16px',
    background: '#1c3a52',
    color: '#e5e5e5',
    border: '1px solid #01b4e4',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
  },
  actions: { display: 'flex', gap: 8 },
  btn: {
    background: 'transparent',
    color: '#90cae4',
    border: '1px solid #2a3f55',
    borderRadius: 6,
    padding: '6px 12px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  primary: { background: '#01b4e4', color: '#0d253f', border: 'none' },
};
