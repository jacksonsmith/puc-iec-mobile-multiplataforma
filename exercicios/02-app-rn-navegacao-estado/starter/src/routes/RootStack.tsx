// src/routes/RootStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator
//
// Estrutura: Stack { Home = MainTabs (Filmes | Favoritos | Settings), Detail }

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from '@/routes/MainTabs';
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
      {/* Os headers das abas são das próprias tabs; o do stack fica oculto na Home. */}
      <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
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
