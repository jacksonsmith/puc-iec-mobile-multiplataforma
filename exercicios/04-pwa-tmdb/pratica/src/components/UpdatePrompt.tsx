// src/components/UpdatePrompt.tsx
// Aviso de ciclo de vida do Service Worker (registerType: 'prompt'):
//   - offlineReady → primeira instalação concluída, o app já abre sem rede
//   - needRefresh  → há um SW novo em "waiting"; o usuário decide quando ativar
// Só aparece no build (npm run build && npm run preview) — no dev não há SW.

import { useRegisterSW } from 'virtual:pwa-register/react';
import { styles } from './UpdatePrompt.styles';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  // Nova versão tem prioridade: é a única que pede uma ação do usuário.
  if (needRefresh) {
    return (
      <div role="alert" style={styles.toast}>
        <span style={styles.message}>🔄 Nova versão disponível</span>
        {/* true = ativa o SW em waiting (skipWaiting) e recarrega a página */}
        <button style={styles.primaryBtn} onClick={() => updateServiceWorker(true)}>
          Atualizar
        </button>
        <button style={styles.secondaryBtn} onClick={() => setNeedRefresh(false)}>
          Depois
        </button>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div role="status" style={styles.toast}>
        <span style={styles.message}>✅ App pronto para uso offline</span>
        <button style={styles.secondaryBtn} onClick={() => setOfflineReady(false)}>
          OK
        </button>
      </div>
    );
  }

  return null;
}
