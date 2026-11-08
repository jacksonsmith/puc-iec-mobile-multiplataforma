// src/routes/HomeTabs.tsx
//
// ATIVIDADE 2 — bônus: Bottom Tabs com aba Favoritos.

import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieList from '@/screens/MovieList';
import Favorites from '@/screens/Favorites';

export type HomeTabsParamList = {
  Movies: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<HomeTabsParamList>();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: '#888',
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Movies"
        component={MovieList}
        options={{
          title: 'Filmes',
          tabBarLabel: 'Filmes',
          tabBarIcon: ({ focused }) => <Text>{focused ? '🎬' : '🎞️'}</Text>,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoritos',
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ focused }) => <Text>{focused ? '❤️' : '🤍'}</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
