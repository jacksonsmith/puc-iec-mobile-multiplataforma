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

const boxStyle: React.CSSProperties = {
  position: 'fixed',
  left: 16,
  right: 16,
  bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))', // acima da BottomTabBar
  zIndex: 1000,
  maxWidth: 480,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  padding: '12px 16px',
  borderRadius: 12,
  background: '#0d253f',
  border: '1px solid #01b4e4',
  color: '#e5e5e5',
  fontSize: 14,
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: 8,
  border: '1px solid #01b4e4',
  background: 'transparent',
  color: '#01b4e4',
  fontSize: 14,
  cursor: 'pointer',
};

const primaryButtonStyle: React.CSSProperties = { ...buttonStyle, background: '#01b4e4', color: '#0d253f' };

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  // nova versão tem prioridade: é a mensagem que pede uma decisão do usuário
  if (needRefresh) {
    return (
      <div role="alert" style={boxStyle}>
        <span style={{ flex: 1 }}>🔄 Nova versão disponível</span>
        <button type="button" style={primaryButtonStyle} onClick={() => updateServiceWorker(true)}>
          Atualizar
        </button>
        <button type="button" style={buttonStyle} onClick={() => setNeedRefresh(false)}>
          Depois
        </button>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div role="status" style={boxStyle}>
        <span style={{ flex: 1 }}>✅ App pronto para uso offline</span>
        <button type="button" style={buttonStyle} onClick={() => setOfflineReady(false)}>
          OK
        </button>
      </div>
    );
  }

  return null;
}
