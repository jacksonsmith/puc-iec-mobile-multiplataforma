// src/components/UpdatePrompt.tsx
// ✅ AVALIATIVO — TODO 3 (parte 2)
//
// Avisos do Service Worker (registerType: 'prompt'):
//   - offlineReady → "App pronto para uso offline" (o SW terminou de cachear o app shell)
//   - needRefresh  → "Nova versão disponível": o SW novo fica em "waiting" até o usuário clicar Atualizar
//
// ⚠️ Só funciona no BUILD (npm run build && npm run preview) — no npm run dev não há SW.

import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (needRefresh) {
    return (
      <div role="alert" className="update-prompt" style={styles.toast}>
        <span style={styles.text}>🔄 Nova versão disponível</span>
        <div style={styles.actions}>
          <button onClick={() => updateServiceWorker(true)} style={{ ...styles.btn, ...styles.primary }}>
            Atualizar
          </button>
          <button onClick={() => setNeedRefresh(false)} style={{ ...styles.btn, ...styles.secondary }}>
            Depois
          </button>
        </div>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div role="status" className="update-prompt" style={styles.toast}>
        <span style={styles.text}>✅ App pronto para uso offline</span>
        <button onClick={() => setOfflineReady(false)} style={{ ...styles.btn, ...styles.secondary }}>
          OK
        </button>
      </div>
    );
  }

  return null;
}

const styles: Record<string, React.CSSProperties> = {
  toast: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '12px 16px',
    background: '#1c3a52',
    color: '#e5e5e5',
    border: '1px solid #01b4e4',
    borderRadius: 10,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
    zIndex: 200,
  },
  text: { fontSize: 14, fontWeight: 600 },
  actions: { display: 'flex', gap: 8 },
  btn: {
    border: 'none',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  primary: { background: '#01b4e4', color: '#0d253f' },
  secondary: { background: '#37474f', color: '#fff' },
};
