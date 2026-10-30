// src/components/UpdatePrompt.tsx
// TODO 3 (parte 2): avisos de "pronto para offline" e "nova versão disponível".

import { useRegisterSW } from "virtual:pwa-register/react";

const boxStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 16,
  right: 16,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 16px",
  borderRadius: 8,
  background: "#1e293b",
  color: "#fff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
};

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (needRefresh) {
    return (
      <div style={boxStyle} role="alert">
        <span>Nova versão disponível</span>
        <button onClick={() => updateServiceWorker(true)}>Atualizar</button>
        <button onClick={() => setNeedRefresh(false)}>Depois</button>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div style={boxStyle} role="status">
        <span>App pronto para uso offline</span>
        <button onClick={() => setOfflineReady(false)}>OK</button>
      </div>
    );
  }

  return null;
}
