// src/routes/RootStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator
//      https://reactnavigation.org/docs/bottom-tab-navigator
//
// Stack na raiz (pra Detail abrir por cima das abas) + Bottom Tabs com
// "Filmes" e "Favoritos" (bônus da Atividade 2).

import { Text } from 'react-native';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieList from '@/screens/MovieList';
import MovieDetail from '@/screens/MovieDetail';
import Favorites from '@/screens/Favorites';
import { useFavoritesStore } from '@/store/favoritesStore';

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Detail: { id: number; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const favoritesCount = useFavoritesStore((s) => s.ids.length);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={MovieList}
        options={{
          title: 'Filmes',
          tabBarIcon: ({ size }) => <Text style={{ fontSize: size - 4 }}>🎬</Text>,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ size }) => <Text style={{ fontSize: size - 4 }}>❤️</Text>,
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
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
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Detail"
        component={MovieDetail}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Voltar',
        })}
      />
    </Stack.Navigator>
  );
}
