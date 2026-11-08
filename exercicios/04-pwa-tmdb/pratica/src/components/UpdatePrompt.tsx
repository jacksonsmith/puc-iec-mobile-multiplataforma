// src/components/UpdatePrompt.tsx
// ✅ AVALIATIVO — TODO 3 (parte 2)
//
// O app já renderiza <UpdatePrompt /> em App.tsx. Seu trabalho é fazer ele funcionar.
//
// Use o hook do vite-plugin-pwa:
//   import { useRegisterSW } from 'virtual:pwa-register/react';
//
// Ele devolve dois estados (cada um é um par [valor, setter]) e uma função:
//   - offlineReady  → true quando o app terminou de ser cacheado ("já funciona offline")
//   - needRefresh   → true quando existe uma NOVA versão esperando (SW em "waiting")
//   - updateServiceWorker(true) → ativa a nova versão e recarrega a página
//
// ⚠️ Só funciona com registerType: 'prompt' (TODO 3, parte 1) e no BUILD (npm run build && npm run preview).

import type { CSSProperties } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  // Nenhum aviso ativo → não ocupa espaço na tela.
  if (!offlineReady && !needRefresh) return null;

  return (
    <div role="status" aria-live="polite" style={styles.container}>
      {needRefresh ? (
        <>
          <span style={styles.message}>Nova versão disponível</span>
          <div style={styles.actions}>
            <button style={styles.primary} onClick={() => updateServiceWorker(true)}>
              Atualizar
            </button>
            <button style={styles.secondary} onClick={() => setNeedRefresh(false)}>
              Depois
            </button>
          </div>
        </>
      ) : (
        <>
          <span style={styles.message}>App pronto para uso offline</span>
          <div style={styles.actions}>
            <button style={styles.secondary} onClick={() => setOfflineReady(false)}>
              Dispensar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'fixed',
    left: 16,
    right: 16,
    bottom: 80,
    zIndex: 200,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    maxWidth: 688,
    margin: '0 auto',
    padding: '12px 16px',
    borderRadius: 10,
    background: '#112233',
    border: '1px solid #01b4e4',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
  },
  message: { fontSize: 14, color: '#e0e0e0' },
  actions: { display: 'flex', gap: 8 },
  primary: {
    padding: '8px 14px',
    borderRadius: 6,
    border: 'none',
    background: '#01b4e4',
    color: '#0d253f',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  secondary: {
    padding: '8px 14px',
    borderRadius: 6,
    border: '1px solid #2a3f55',
    background: 'transparent',
    color: '#e0e0e0',
    fontSize: 13,
    cursor: 'pointer',
  },
};
