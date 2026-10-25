// src/routes/RootStack.tsx
//
// CAMADA ROUTES: navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator

import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovieDetail from '@/screens/MovieDetail';
import { colors } from '@/theme';
import HomeTabs, { type HomeTabsParamList } from './HomeTabs';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<HomeTabsParamList>;
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
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Tabs" component={HomeTabs} options={{ headerShown: false }} />
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
