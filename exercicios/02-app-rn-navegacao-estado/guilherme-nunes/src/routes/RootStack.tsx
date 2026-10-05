import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { Text } from 'react-native';
import FavoritesScreen from '@/screens/FavoritesScreen';
import MovieDetail from '@/screens/MovieDetail';
import MovieList from '@/screens/MovieList';

export type MainTabParamList = {
  Movies: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Detail: { id: number; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 18 }}>{route.name === 'Movies' ? '🎬' : '❤️'}</Text>
        ),
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
      })}
    >
      <Tabs.Screen name="Movies" component={MovieList} options={{ title: 'Filmes', tabBarLabel: 'Filmes' }} />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoritos', tabBarLabel: 'Favoritos' }}
      />
    </Tabs.Navigator>
  );
}

export default function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Detail"
        component={MovieDetail}
        options={({ route }) => ({ title: route.params.title, headerBackTitle: 'Voltar' })}
      />
    </Stack.Navigator>
  );
}
