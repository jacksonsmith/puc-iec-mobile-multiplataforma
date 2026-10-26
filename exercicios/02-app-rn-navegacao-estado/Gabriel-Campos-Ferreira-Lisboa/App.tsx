import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import MovieDetail from './src/screens/MovieDetail';
import MovieList from './src/screens/MovieList';
import type { RootStackParamList } from './src/routes/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <StatusBar style="dark" />
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: { backgroundColor: '#fff' },
                        headerTintColor: '#111827',
                        headerTitleStyle: { fontWeight: '700' },
                        contentStyle: { backgroundColor: '#f9fafb' },
                    }}
                >
                    <Stack.Screen name="Home" component={MovieList} options={{ title: 'CineFeed' }} />
                    <Stack.Screen
                        name="Detail"
                        component={MovieDetail}
                        options={({ route }) => ({ title: route.params.title })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    );
}
