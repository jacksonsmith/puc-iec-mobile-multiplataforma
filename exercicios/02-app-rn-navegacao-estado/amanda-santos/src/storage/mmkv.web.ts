// Metro escolhe este arquivo no navegador; Android/iOS usam MMKV nativo.
export const mmkvStorage = {
 getItem: (key: string): string | null => typeof localStorage === 'undefined' ? null : localStorage.getItem(key),
 setItem: (key: string, value: string) => localStorage.setItem(key, value),
 removeItem: (key: string) => localStorage.removeItem(key),
};
