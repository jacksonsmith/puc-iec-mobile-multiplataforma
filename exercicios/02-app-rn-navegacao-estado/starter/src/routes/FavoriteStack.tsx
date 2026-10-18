// src/routes/FavoritesStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieDetail from '@/screens/MovieDetail';
import FavoriteMovieList from '@/screens/FavoriteMovieList';

export type FavoritesStackParamList = {
  Home: undefined;
  Detail: { id: number; title?: string };
};

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export default function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Garante header back button visível em web e nativo
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={FavoriteMovieList} />
      <Stack.Screen
        name="Detail"
        component={MovieDetail}
        options={({ route }) => ({
          title: route.params.title,
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}
