// src/routes/RootStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator
//
// Home agora é o Bottom Tabs (Filmes + Favoritos); Detail empilha por cima.

import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs, { type TabParamList } from '@/routes/MainTabs';
import MovieDetail from '@/screens/MovieDetail';

export type RootStackParamList = {
  Home: NavigatorScreenParams<TabParamList> | undefined;
  // title é opcional: vindo de deep link (expo://detail/<id>) só temos o id
  Detail: { id: number; title?: string };
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
      {/* Os tabs têm header próprio, então escondemos o do stack */}
      <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Detail"
        component={MovieDetail}
        options={({ route }) => ({
          title: route.params.title ?? 'Detalhe',
          headerBackTitle: 'Voltar',
        })}
      />
    </Stack.Navigator>
  );
}
