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

const bannerStyle: React.CSSProperties = {
  position: 'fixed',
  left: 16,
  right: 16,
  bottom: 80, // acima da BottomTabBar
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 16px',
  background: '#01b4e4',
  color: '#0d253f',
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
};

const btnStyle: React.CSSProperties = {
  background: '#0d253f',
  color: '#01b4e4',
  border: 'none',
  borderRadius: 6,
  padding: '6px 14px',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 13,
  whiteSpace: 'nowrap',
};

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (needRefresh) {
    return (
      <div style={bannerStyle} role="alert">
        <span>🔄 Nova versão disponível</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnStyle} onClick={() => updateServiceWorker(true)}>Atualizar</button>
          <button style={btnStyle} onClick={() => setNeedRefresh(false)}>Depois</button>
        </div>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div style={bannerStyle} role="status">
        <span>✅ App pronto para uso offline</span>
        <button style={btnStyle} onClick={() => setOfflineReady(false)}>OK</button>
      </div>
    );
  }

  return null;
}
