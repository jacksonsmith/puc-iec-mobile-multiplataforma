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
        headerBackVisible: true,
        headerBackTitle: 'Voltar',
      }}
    >

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
