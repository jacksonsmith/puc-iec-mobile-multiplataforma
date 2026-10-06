import { Platform } from 'react-native';

type SyncStorage = {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
};

// MMKV é nativo (JSI); em web usa localStorage e em Jest/ambientes sem bridge
// usa um fallback em memória para permitir testes sem carregar módulos nativos.
const memory = new Map<string, string>();
let nativeStorage: {
    getString: (key: string) => string | undefined;
    set: (key: string, value: string) => void;
    delete: (key: string) => void;
} | undefined;

if (Platform.OS !== 'web') {
    try {
        const { MMKV } = require('react-native-mmkv');
        nativeStorage = new MMKV({ id: 'favorites-store' });
    } catch {
        // Ambiente de teste sem runtime nativo.
    }
}

export const mmkvStorage: SyncStorage = {
    getItem(key) {
        if (Platform.OS === 'web') {
            try {
                return window.localStorage.getItem(key);
            } catch {
                return memory.get(key) ?? null;
            }
        }
        return nativeStorage?.getString(key) ?? memory.get(key) ?? null;
    },
    setItem(key, value) {
        if (Platform.OS === 'web') {
            try {
                window.localStorage.setItem(key, value);
                return;
            } catch {
                memory.set(key, value);
                return;
            }
        }
        if (nativeStorage) nativeStorage.set(key, value);
        else memory.set(key, value);
    },
    removeItem(key) {
        if (Platform.OS === 'web') {
            try {
                window.localStorage.removeItem(key);
            } catch {
                memory.delete(key);
            }
            return;
        }
        if (nativeStorage) nativeStorage.delete(key);
        memory.delete(key);
    },
};
