// src/routes/RootStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MovieDetail from "@/screens/MovieDetail";
import MainTabs from "@/routes/MainTabs";

export type RootStackParamList = {
  Main: undefined;
  Detail: { id: number; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Garante header back button visível em web e nativo
        headerBackVisible: true,
        headerBackTitle: "Voltar",
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Detail"
        component={MovieDetail}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: "Voltar",
        })}
      />
    </Stack.Navigator>
  );
}
