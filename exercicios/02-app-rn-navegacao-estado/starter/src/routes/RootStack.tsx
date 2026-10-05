// src/routes/RootStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import MovieList from '@/screens/MovieList';
import MovieDetail from '@/screens/MovieDetail';
import FavoritesList from '@/screens/FavoritesList';

export type RootStackParamList = {
  MainTabs: undefined;
  Detail: { id: number; title?: string };
};

export type MainTabsParamList = {
  Movies: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#d81b60',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="Movies"
        component={MovieList}
        options={{
          title: 'Filmes',
          tabBarLabel: 'Filmes',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎬</Text>,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesList}
        options={{
          title: 'Favoritos',
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>❤️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Garante header back button visível em web e nativo
        headerBackVisible: true,
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Detail"
        component={MovieDetail}
        options={({ route }) => ({
          title: route.params.title ?? 'Detalhes',
          headerBackTitle: 'Voltar',
        })}
      />
    </Stack.Navigator>
  );
}
