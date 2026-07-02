// src/components/InstallButton.tsx

import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { styles } from './InstallButton.styles';

export function InstallButton() {
  const { canInstall, triggerInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button onClick={triggerInstall} style={styles.btn}>
      📲 Instalar app
    </button>
  );
}
