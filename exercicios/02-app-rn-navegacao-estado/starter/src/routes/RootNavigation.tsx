import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RootStack from './RootStack';
import FavoritiesStack from './FavoriteStack';

const Tab = createBottomTabNavigator();

export function RootNavigation() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={RootStack} />
            <Tab.Screen name="Favorities" component={FavoritiesStack} />
            <Tab.Screen name="Settings" component={RootStack} />
        </Tab.Navigator>
    );
}