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
  bottom: 70,
  left: 0,
  right: 0,
  background: '#01b4e4',
  color: '#fff',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 999,
  fontSize: 14,
};

const btnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.25)',
  border: 'none',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: 6,
  cursor: 'pointer',
  marginLeft: 8,
};

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (offlineReady) {
    return (
      <div style={bannerStyle}>
        <span>✅ App pronto para uso offline</span>
        <button style={btnStyle} onClick={() => setOfflineReady(false)}>Fechar</button>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div style={bannerStyle}>
        <span>🔄 Nova versão disponível</span>
        <div>
          <button style={btnStyle} onClick={() => updateServiceWorker(true)}>Atualizar</button>
          <button style={btnStyle} onClick={() => setNeedRefresh(false)}>Depois</button>
        </div>
      </div>
    );
  }

  return null;
}
