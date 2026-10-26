// src/components/UpdatePrompt.tsx
// TODO 3 (parte 2): avisos do Service Worker (registerType: 'prompt').
//
//   offlineReady → o app terminou de ser cacheado e já abre sem rede
//   needRefresh  → há uma nova versão em espera; só ativa quando o usuário aceita
//
// Só aparece no build (npm run build && npm run preview): o SW não roda no npm run dev.

import { useRegisterSW } from 'virtual:pwa-register/react';
import { styles } from './UpdatePrompt.styles';

// Abas que ficam abertas por horas nunca recarregam: pergunta ao servidor por versão nova.
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      setInterval(() => {
        registration.update().catch(() => {}); // offline: tenta de novo no próximo ciclo
      }, UPDATE_CHECK_INTERVAL_MS);
    },
  });

  if (!offlineReady && !needRefresh) return null;

  const dismiss = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div role="status" aria-live="polite" className="update-toast" style={styles.toast}>
      <span style={styles.message}>
        {needRefresh ? '🔄 Nova versão disponível' : '✅ App pronto para uso offline'}
      </span>
      <div style={styles.actions}>
        {needRefresh && (
          <button onClick={() => updateServiceWorker(true)} style={styles.primary}>
            Atualizar
          </button>
        )}
        <button onClick={dismiss} style={styles.secondary}>
          {needRefresh ? 'Depois' : 'OK'}
        </button>
      </div>
    </div>
  );
}
