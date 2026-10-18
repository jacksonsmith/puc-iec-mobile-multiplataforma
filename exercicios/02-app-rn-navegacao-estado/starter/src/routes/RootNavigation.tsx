import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RootStack from './RootStack';
import FavoritesStack from './FavoriteStack';

const Tab = createBottomTabNavigator();

export function RootNavigation() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={RootStack} />
            <Tab.Screen name="Favorites" component={FavoritesStack} />
            <Tab.Screen name="Settings" component={RootStack} />
        </Tab.Navigator>
    );
}