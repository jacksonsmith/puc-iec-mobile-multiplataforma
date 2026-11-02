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

const bannerStyle = {
  position: 'sticky' as const,
  top: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 16px',
  background: '#0d253f',
  color: '#ffffff',
  fontSize: 14,
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const buttonStyle = {
  border: 'none',
  borderRadius: 8,
  padding: '8px 12px',
  fontWeight: 600,
  cursor: 'pointer',
};

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  if (needRefresh) {
    return (
      <div style={bannerStyle}>
        <span>Nova versão disponível</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            style={{ ...buttonStyle, background: '#01b4e4', color: '#08243c' }}
          >
            Atualizar
          </button>
          <button
            type="button"
            onClick={() => setNeedRefresh(false)}
            style={{ ...buttonStyle, background: '#20364d', color: '#f5f5f5' }}
          >
            Depois
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={bannerStyle}>
      <span>App pronto para uso offline</span>
      <button
        type="button"
        onClick={() => setOfflineReady(false)}
        style={{ ...buttonStyle, background: '#20364d', color: '#f5f5f5' }}
      >
        OK
      </button>
    </div>
  );
}
