import { mmkvStorage } from '../src/storage/mmkv';
import { useFavoritesStore } from '../src/store/favoritesStore';

const STORAGE_KEY = 'favorites-ids';

describe('favoritesStore', () => {
    beforeEach(() => {
        mmkvStorage.removeItem(STORAGE_KEY);
        useFavoritesStore.setState({ ids: [] });
    });

    test('add inclui um filme e não duplica o ID', () => {
        const store = useFavoritesStore.getState();
        store.add(42);
        store.add(42);
        expect(useFavoritesStore.getState().ids).toEqual([42]);
    });

    test('remove exclui somente o ID informado', () => {
        useFavoritesStore.setState({ ids: [10, 20, 30] });
        useFavoritesStore.getState().remove(20);
        expect(useFavoritesStore.getState().ids).toEqual([10, 30]);
    });

    test('toggle adiciona e depois remove o ID', () => {
        const { toggle } = useFavoritesStore.getState();
        toggle(7);
        expect(useFavoritesStore.getState().ids).toEqual([7]);
        toggle(7);
        expect(useFavoritesStore.getState().ids).toEqual([]);
    });

    test('isFavorite reflete o estado atual', () => {
        useFavoritesStore.getState().add(88);
        expect(useFavoritesStore.getState().isFavorite(88)).toBe(true);
        expect(useFavoritesStore.getState().isFavorite(89)).toBe(false);
    });

    test('clear remove todos os favoritos', () => {
        useFavoritesStore.setState({ ids: [1, 2, 3] });
        useFavoritesStore.getState().clear();
        expect(useFavoritesStore.getState().ids).toEqual([]);
    });

    test('persiste os IDs no storage síncrono', () => {
        useFavoritesStore.getState().add(101);
        expect(mmkvStorage.getItem(STORAGE_KEY)).toBe('[101]');
    });
});
