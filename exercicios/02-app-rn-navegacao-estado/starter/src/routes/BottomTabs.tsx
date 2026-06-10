// src/routes/BottomTabs.tsx
//
// CAMADA ROUTES — navegação por abas.
// Doc: https://reactnavigation.org/docs/bottom-tab-navigator

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import RootStack from './RootStack';
import type { RootStackParamList } from './RootStack';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MovieDetail from '../screens/MovieDetail';
import { useFavoritesStore } from '../store/favoritesStore';

export type BottomTabParamList = {
  HomeTab: undefined;
  FavoritesTab: undefined;
  SettingsTab: undefined;
};

// Stack próprio para a aba Favoritos, espelhando as rotas do RootStack.
// MovieCard chama navigate('Detail') — com esse stack, a rota existe no
// contexto imediato da aba, exatamente como ocorre na aba Home.
const FavStack = createNativeStackNavigator<RootStackParamList>();

function FavoritesStack() {
  return (
    <FavStack.Navigator screenOptions={{ headerBackTitle: 'Voltar' }}>
      <FavStack.Screen
        name="Home"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
      <FavStack.Screen
        name="Detail"
        component={MovieDetail}
        options={({ route }) => ({ title: route.params.title, headerBackTitle: 'Voltar' })}
      />
    </FavStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  const favCount = useFavoritesStore((s) => s.ids.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'HomeTab') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
          }
          if (route.name === 'FavoritesTab') {
            return <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />;
          }
          return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#8e8e93',
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={RootStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          title: 'Favoritos',
          headerShown: false,
          tabBarBadge: favCount > 0 ? favCount : undefined,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: 'Settings', headerShown: true }}
      />
    </Tab.Navigator>
  );
}
