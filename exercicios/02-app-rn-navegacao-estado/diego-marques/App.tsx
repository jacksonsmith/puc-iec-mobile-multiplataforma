import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '@/services/query-client';
import RootStack from '@/routes/RootStack';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootStack />
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
