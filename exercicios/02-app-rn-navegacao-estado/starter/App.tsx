// App.tsx — root provider tree
//
// Ordem importa:
// 1. QueryClientProvider (server state via TanStack Query)
// 2. ThemeProvider (estado global app via Context)
// 3. NavigationContainer
// 4. RootStack (screens)

import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import RootStack, { type RootStackParamList } from '@/routes/RootStack';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['expo://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Movies: '',
          Favorites: 'favorites',
        },
      },
      Detail: {
        path: 'detail/:id',
        parse: { id: Number },
      },
    },
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavigationContainer linking={linking}>
          <RootStack />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
