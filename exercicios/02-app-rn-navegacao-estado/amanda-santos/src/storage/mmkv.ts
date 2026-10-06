import { MMKV } from 'react-native-mmkv';
const storage = new MMKV({ id: 'favorites-store' });
export const mmkvStorage = {
 getItem: (key: string): string | null => storage.getString(key) ?? null,
 setItem: (key: string, value: string) => storage.set(key, value),
 removeItem: (key: string) => storage.delete(key),
};
