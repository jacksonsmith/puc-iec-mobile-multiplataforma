import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieList from '@/screens/MovieList';
import Favorites from '@/screens/Favorites';
import { useFavoritesStore } from '@/store/favoritesStore';

export type HomeTabParamList = {
  Movies: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

const tabIcon = (name: keyof typeof Ionicons.glyphMap) =>
  function TabIcon({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };

export default function HomeTabs() {
  const favCount = useFavoritesStore((s) => s.ids.length);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Movies"
        component={MovieList}
        options={{ title: 'Filmes', tabBarIcon: tabIcon('film-outline') }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoritos',
          tabBarIcon: tabIcon('heart-outline'),
          tabBarBadge: favCount > 0 ? favCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}
