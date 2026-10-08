// src/routes/MainTabs.tsx
//
// BÔNUS — Bottom Tabs: Filmes | Favoritos | Settings.
// Doc: https://reactnavigation.org/docs/bottom-tab-navigator

import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieList from '@/screens/MovieList';
import FavoritesScreen from '@/screens/FavoritesScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { useFavoritesStore } from '@/store/favoritesStore';

export type MainTabParamList = {
  Movies: undefined;
  Favorites: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const icon = (emoji: string) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

export default function MainTabs() {
  // Badge com a quantidade de favoritos (some quando é 0).
  const favCount = useFavoritesStore((s) => s.ids.length);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Movies"
        component={MovieList}
        options={{ title: 'Filmes', tabBarIcon: icon('🎬') }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favoritos',
          tabBarIcon: icon('❤️'),
          tabBarBadge: favCount > 0 ? favCount : undefined,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings', tabBarIcon: icon('⚙️') }}
      />
    </Tab.Navigator>
  );
}
