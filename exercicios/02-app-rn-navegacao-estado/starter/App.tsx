// App.tsx — root provider tree
//
// Ordem importa:
// 1. QueryClientProvider (server state via TanStack Query)
// 2. ThemeProvider (estado global app via Context)
// 3. NavigationContainer (com deep linking)
// 4. RootStack (Bottom Tabs + Detail)
//
// GestureHandlerRootView envolve tudo: necessário pro swipe do SwipeableCard.

import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/contexts/ThemeContext';
import RootStack from '@/routes/RootStack';
import { linking } from '@/routes/linking';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NavigationContainer linking={linking}>
            <RootStack />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
