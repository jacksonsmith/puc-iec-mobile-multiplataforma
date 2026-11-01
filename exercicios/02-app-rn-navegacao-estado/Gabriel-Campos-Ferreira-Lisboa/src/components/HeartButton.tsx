import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

type Props = {
    active: boolean;
    onPress: () => void;
};

export default function HeartButton({ active, onPress }: Props) {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    }));

    const handlePress = () => {
        // Animação executada como worklet na UI thread; sem Animated legado.
        scale.value = withSequence(
            withTiming(1.4, { duration: 120 }),
            withSpring(1, { damping: 7, stiffness: 240 }),
        );
        rotation.value = withSequence(
            withTiming(-12, { duration: 120 }),
            withSpring(0, { damping: 8, stiffness: 220 }),
        );
        onPress();
    };

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            accessibilityState={{ selected: active }}
            hitSlop={8}
            onPress={(event) => {
                event.stopPropagation();
                handlePress();
            }}
            style={styles.button}
        >
            <Animated.View style={animatedStyle}>
                <Text style={[styles.heart, active ? styles.active : styles.inactive]}>{active ? '♥' : '♡'}</Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: { padding: 8, justifyContent: 'center', alignItems: 'center' },
    heart: { fontSize: 29, lineHeight: 34 },
    active: { color: '#e11d48' },
    inactive: { color: '#6b7280' },
});
