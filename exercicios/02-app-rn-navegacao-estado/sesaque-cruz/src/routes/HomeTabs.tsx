// src/routes/HomeTabs.tsx
//
// BÔNUS ATIVIDADE 2: Bottom Tabs (Filmes | Favoritos), aninhado no RootStack.
// Doc: https://reactnavigation.org/docs/bottom-tab-navigator

import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieList from '@/screens/MovieList';
import Favorites from '@/screens/Favorites';
import { useFavoritesStore } from '@/store/favoritesStore';
import { colors } from '@/theme';

export type HomeTabsParamList = {
  Home: undefined;
  Favorites: undefined;
};

type IconName = ComponentProps<typeof Ionicons>['name'];

const Tab = createBottomTabNavigator<HomeTabsParamList>();

const tabIcon =
  (active: IconName, inactive: IconName) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
    <Ionicons name={focused ? active : inactive} color={color} size={size} />
  );

export default function HomeTabs() {
  const favoritesCount = useFavoritesStore((s) => s.ids.length);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        // Cada tela desenha o próprio título grande no topo da lista.
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={MovieList}
        options={{ title: 'Filmes', tabBarIcon: tabIcon('film', 'film-outline') }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoritos',
          tabBarIcon: tabIcon('heart', 'heart-outline'),
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.primary, fontSize: 11 },
        }}
      />
    </Tab.Navigator>
  );
}
