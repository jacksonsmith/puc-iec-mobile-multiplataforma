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

  return (
    <aside
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        zIndex: 1000,
        right: 16,
        bottom: 88,
        maxWidth: 360,
        padding: 16,
        borderRadius: 12,
        background: '#1c2d40',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
      }}
    >
      <p style={{ margin: '0 0 12px' }}>
        {needRefresh ? 'Nova versão disponível' : 'App pronto para uso offline'}
      </p>
      {needRefresh ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => void updateServiceWorker(true)}>Atualizar</button>
          <button onClick={() => setNeedRefresh(false)}>Depois</button>
        </div>
      ) : (
        <button onClick={() => setOfflineReady(false)}>Dispensar</button>
      )}
    </aside>
  );
}
