// src/routes/RootStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from '@/routes/HomeTabs';
import MovieDetail from '@/screens/MovieDetail';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Garante header back button visível em web e nativo
        headerBackVisible: true,
        headerBackTitle: 'Voltar',
      }}
    >
      {/* Home = Bottom Tabs (Filmes + Favoritos); header vem de cada aba */}
      <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false, title: 'Filmes' }} />
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
