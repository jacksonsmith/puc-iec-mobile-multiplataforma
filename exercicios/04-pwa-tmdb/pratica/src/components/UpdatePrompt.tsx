// src/components/UpdatePrompt.tsx
// ✅ AVALIATIVO — TODO 3 (parte 2)
//
// Avisos do ciclo de vida do Service Worker, via useRegisterSW (vite-plugin-pwa):
//   - offlineReady → o precache terminou: o app já abre sem rede.
//   - needRefresh  → um SW novo foi instalado e está em "waiting". Com registerType 'prompt'
//                    ele só assume quando o usuário clicar em Atualizar.
//   - updateServiceWorker(true) → manda o SW em espera assumir (skipWaiting) e recarrega a página.
//
// Só aparece no build (npm run build && npm run preview); no npm run dev não há SW.

import { useRegisterSW } from 'virtual:pwa-register/react';
import { styles } from './UpdatePrompt.styles';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  // Versão nova tem prioridade: é o aviso que pede uma decisão do usuário.
  if (needRefresh) {
    return (
      <div role="alert" style={styles.toast}>
        <span>🔄 Nova versão disponível</span>
        <div style={styles.actions}>
          <button onClick={() => updateServiceWorker(true)} style={styles.primary}>
            Atualizar
          </button>
          <button onClick={() => setNeedRefresh(false)} style={styles.secondary}>
            Depois
          </button>
        </div>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div role="status" style={styles.toast}>
        <span>✅ App pronto para uso offline</span>
        <button onClick={() => setOfflineReady(false)} style={styles.secondary}>
          OK
        </button>
      </div>
    );
  }

  return null;
}
