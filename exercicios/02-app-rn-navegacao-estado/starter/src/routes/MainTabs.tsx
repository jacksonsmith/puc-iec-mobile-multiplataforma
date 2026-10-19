// src/routes/MainTabs.tsx
//
// BÔNUS — Bottom Tabs: Filmes + Favoritos (com badge da quantidade).
// Doc: https://reactnavigation.org/docs/bottom-tab-navigator

import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieList from '@/screens/MovieList';
import Favorites from '@/screens/Favorites';
import { useFavoritesStore } from '@/store/favoritesStore';

export type TabParamList = {
  Movies: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  const favCount = useFavoritesStore((s) => s.ids.length);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Movies"
        component={MovieList}
        options={{ title: 'Filmes', tabBarIcon: () => <Text>🎬</Text> }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoritos',
          tabBarIcon: () => <Text>❤️</Text>,
          tabBarBadge: favCount > 0 ? favCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}
