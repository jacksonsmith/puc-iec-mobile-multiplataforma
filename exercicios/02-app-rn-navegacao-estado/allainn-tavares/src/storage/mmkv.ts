// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

// Navegador tem localStorage; iOS/Android não. No Jest também não tem, então
// os testes caem no MMKV, que se auto-mocka em memória quando roda no Jest.
// Com os dados do site bloqueados, só ler window.localStorage já lança erro:
// aí cai no MMKV, que na web guarda em memória, em vez de derrubar o app.
const hasLocalStorage = (() => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
})();

let getString: (k: string) => string | undefined;
let setItem: (k: string, v: string) => void;
let deleteItem: (k: string) => void;

if (hasLocalStorage) {
  getString = (k) => window.localStorage.getItem(k) ?? undefined;
  setItem = (k, v) => window.localStorage.setItem(k, v);
  deleteItem = (k) => window.localStorage.removeItem(k);
} else {
  // require dentro do else: com localStorage disponível, o código do MMKV nem é executado
  const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  const storage = new MMKV({ id: 'favorites-store' });
  getString = (k) => storage.getString(k);
  setItem = (k, v) => storage.set(k, v);
  deleteItem = (k) => storage.delete(k);
}

// Mesma interface do Storage da web (getItem/setItem/removeItem) e síncrona
// nas duas plataformas: quem usa não precisa saber qual está por baixo.
export const mmkvStorage = {
  getItem: (name: string): string | null => getString(name) ?? null,
  setItem: (name: string, value: string) => setItem(name, value),
  removeItem: (name: string) => deleteItem(name),
};
