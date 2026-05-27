// src/routes/RootStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieList from '@/screens/MovieList';
import MovieDetail from '@/screens/MovieDetail';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={MovieList} options={{ title: 'Filmes' }} />
      <Stack.Screen
        name="Detail"
        component={MovieDetail}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}
