import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

type Props = { active: boolean; onPress: () => void };

export const HeartButton = ({ active, onPress }: Props) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Pressable
            onPress={(event) => {
                event.stopPropagation();
                if (!active) {
                    scale.value = withSequence(withTiming(1.4), withSpring(1));
                }
                onPress();
            }}
            style={styles.heart}
        >
            <Animated.View style={animatedStyle}>
                {active ? <Text style={styles.heartIcon}>❤️</Text> : <Text style={styles.heartIcon}>🤍</Text>}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    heart: { padding: 8 },
    heartIcon: { fontSize: 24 },
});
