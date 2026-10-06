// src/routes/HomeTabs.tsx
//
// BONUS — Bottom Tabs: Filmes + Favoritos.
// Fica DENTRO do RootStack (tela "Home"), então o Detail empilha por cima
// das abas e o botão voltar retorna pra aba de origem.
//
// Doc: https://reactnavigation.org/docs/bottom-tab-navigator

import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieList from '@/screens/MovieList';
import Favorites from '@/screens/Favorites';
import { useFavoritesStore } from '@/store/favoritesStore';

export type HomeTabParamList = {
  Movies: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

const tabIcon = (emoji: string) =>
  function TabIcon({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
  };

export default function HomeTabs() {
  const favCount = useFavoritesStore((s) => s.ids.length);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Movies"
        component={MovieList}
        options={{ title: 'Filmes', tabBarIcon: tabIcon('🎬') }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoritos',
          tabBarIcon: tabIcon('❤️'),
          tabBarBadge: favCount > 0 ? favCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}
