// src/components/RatingBadge.tsx

import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatRating } from '@/utils/format';
import { colors, radius, spacing } from '@/theme';

export default function RatingBadge({ value }: { value: number }) {
  return (
    <View style={styles.badge}>
      <Ionicons name="star" size={12} color={colors.rating} />
      <Text style={styles.text}>{formatRating(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.ratingSoft,
  },
  text: { fontSize: 12, fontWeight: '700', color: colors.ratingText },
});
