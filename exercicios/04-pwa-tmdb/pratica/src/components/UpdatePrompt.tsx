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
// O que o componente deve mostrar:
//   1. offlineReady  → aviso "App pronto para uso offline" + botão para dispensar (setOfflineReady(false))
//   2. needRefresh   → aviso "Nova versão disponível" + botão "Atualizar" (updateServiceWorker(true))
//                      + botão "Depois" que dispensa o aviso (setNeedRefresh(false))
//   3. nenhum dos dois → não renderiza nada (return null)
//
// ⚠️ Só funciona com registerType: 'prompt' (TODO 3, parte 1) e no BUILD (npm run build && npm run preview).

import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  const noticeStyle: React.CSSProperties = {
    position: 'fixed',
    right: 16,
    bottom: 88,
    zIndex: 1000,
    maxWidth: 360,
    padding: 16,
    borderRadius: 12,
    background: '#1c2d40',
    color: '#fff',
    boxShadow: '0 4px 16px #0006',
  };

  if (needRefresh) {
    return (
      <aside role="status" aria-live="polite" style={noticeStyle}>
        <p style={{ margin: '0 0 12px' }}>Nova versão disponível</p>
        <button type="button" onClick={() => updateServiceWorker(true)}>
          Atualizar
        </button>{' '}
        <button type="button" onClick={() => setNeedRefresh(false)}>
          Depois
        </button>
      </aside>
    );
  }

  return (
    <aside role="status" aria-live="polite" style={noticeStyle}>
      <span>App pronto para uso offline</span>{' '}
      <button type="button" onClick={() => setOfflineReady(false)} aria-label="Dispensar aviso">
        ×
      </button>
    </aside>
  );
}
