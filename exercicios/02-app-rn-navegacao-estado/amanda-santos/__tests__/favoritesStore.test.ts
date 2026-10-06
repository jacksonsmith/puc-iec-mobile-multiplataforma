jest.mock('../src/storage/mmkv', () => {
 const values = new Map<string,string>();
 return {mmkvStorage: {getItem: jest.fn((k: string) => values.get(k) ?? null), setItem: jest.fn((k: string,v: string) => values.set(k,v)), removeItem: jest.fn((k: string) => values.delete(k))}};
});
import {useFavoritesStore as store, loadFavorites, STORAGE_KEY} from '../src/store/favoritesStore';
import {mmkvStorage} from '../src/storage/mmkv';
describe('favoritos e persistência', () => {
 beforeEach(() => {store.getState().clear(); mmkvStorage.removeItem(STORAGE_KEY);jest.clearAllMocks();});
 test('toggle adiciona', () => {store.getState().toggle(1);expect(store.getState().ids).toEqual([1]);});
 test('toggle remove', () => {store.getState().toggle(1);store.getState().toggle(1);expect(store.getState().ids).toEqual([]);});
 test('add não duplica e isFavorite reflete estado', () => {store.getState().add(2);store.getState().add(2);expect(store.getState().ids).toEqual([2]);expect(store.getState().isFavorite(2)).toBe(true);});
 test('remove preserva outros favoritos', () => {store.getState().add(1);store.getState().add(2);store.getState().remove(1);expect(store.getState().ids).toEqual([2]);expect(store.getState().isFavorite(1)).toBe(false);});
 test('clear esvazia e persiste', () => {store.getState().add(1);store.getState().clear();expect(store.getState().ids).toEqual([]);expect(mmkvStorage.getItem(STORAGE_KEY)).toBe('[]');});
 test('restaura favoritos salvos', () => {store.getState().add(7);store.getState().add(9);expect(loadFavorites()).toEqual([7,9]);});
 test('recupera de JSON inválido', () => {mmkvStorage.setItem(STORAGE_KEY,'quebrado');expect(loadFavorites()).toEqual([]);});
 test('filtra dados inválidos e duplicados', () => {mmkvStorage.setItem(STORAGE_KEY,'[1,1,"2",-1,null,3]');expect(loadFavorites()).toEqual([1,3]);});
});
