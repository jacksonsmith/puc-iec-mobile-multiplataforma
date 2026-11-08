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

import type { CSSProperties } from 'react';
import { useRegisterSW } from "virtual:pwa-register/react";

const toastStyle: CSSProperties = {
  position: 'fixed',
  left: 16,
  right: 16,
  bottom: 'calc(80px + env(safe-area-inset-bottom))',
  maxWidth: 480,
  margin: '0 auto',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  borderRadius: 12,
  background: '#0d253f',
  color: '#e5e5e5',
  border: '1px solid #2a3f55',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  fontSize: 14,
};

const messageStyle: CSSProperties = { flex: 1, margin: 0, lineHeight: 1.4 };

const actionsStyle: CSSProperties = { display: 'flex', gap: 8, flexShrink: 0 };

const baseButton: CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const primaryButton: CSSProperties = { ...baseButton, background: '#01b4e4', color: '#0d253f' };

const secondaryButton: CSSProperties = { ...baseButton, background: 'transparent', color: '#90cae4' };

export function UpdatePrompt() {
  const { offlineReady: [offlineReady, setOfflineReady], needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();

  if (needRefresh) {
    return (
      <div role="alert" style={{ ...toastStyle, borderLeft: '4px solid #01b4e4' }}>
        <p style={messageStyle}>🔄 Nova versão disponível</p>
        <div style={actionsStyle}>
          <button onClick={() => setNeedRefresh(false)} style={secondaryButton}>Depois</button>
          <button onClick={() => updateServiceWorker(true)} style={primaryButton}>Atualizar</button>
        </div>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div role="status" style={{ ...toastStyle, borderLeft: '4px solid #21d07a' }}>
        <p style={messageStyle}>✅ App pronto para uso offline</p>
        <div style={actionsStyle}>
          <button onClick={() => setOfflineReady(false)} style={secondaryButton}>OK</button>
        </div>
      </div>
    );
  }

  return null;
}
