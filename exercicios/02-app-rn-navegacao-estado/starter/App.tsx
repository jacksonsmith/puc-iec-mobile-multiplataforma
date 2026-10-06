// App.tsx — root provider tree
//
// Ordem importa:
// 1. QueryClientProvider (server state via TanStack Query)
// 2. ThemeProvider (estado global app via Context)
// 3. NavigationContainer
// 4. RootStack (screens)

import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RootNavigation } from '@/routes/RootNavigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
});

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['expo://', Linking.createURL('/')],
  config: {
    screens: {
      Home: {
        screens: {
          Home: '',
          Detail: { path: 'detail/:id', parse: { id: Number } },
        },
      },
      Favorites: {
        screens: {
          Home: 'favorites',
          Detail: { path: 'favorites/detail/:id', parse: { id: Number } },
        },
      },
      Settings: 'settings',
    },
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavigationContainer linking={linking}>
          <RootNavigation />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
