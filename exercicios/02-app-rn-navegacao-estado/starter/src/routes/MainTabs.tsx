import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MovieList from "@/screens/MovieList";
import Favorites from "@/screens/Favorites";

export type MainTabParamList = {
  Movies: undefined;
  Favorites: undefined;
};

const Tabs = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Movies" component={MovieList} options={{ title: "Filmes" }} />
      <Tabs.Screen name="Favorites" component={Favorites} options={{ title: "Favoritos" }} />
    </Tabs.Navigator>
  );
}
