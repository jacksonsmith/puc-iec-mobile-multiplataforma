import { Pressable, ScrollView, View } from 'react-native';

import type { Director } from '@/domain/directors';

import { Glass } from './glass';
import { Text } from './text';

// O chip tem 36px visíveis e a área de toque chega aos 48px com o hitSlop.
const CHIP_HIT_SLOP = { top: 6, bottom: 6 };
const CHIP_CLASS = 'h-9 flex-row items-center gap-1.5 rounded-full px-3.5';

type DirectorChipProps = {
  testID: string;
  label: string;
  count: number;
  isSelected: boolean;
  onPress: () => void;
};

function DirectorChip({ testID, label, count, isSelected, onPress }: DirectorChipProps) {
  const content = (
    <>
      <Text variant="label" tone={isSelected ? 'onSky' : 'ink'}>
        {label}
      </Text>
      <Text variant="meta" tone={isSelected ? 'onSky' : 'muted'}>
        {count}
      </Text>
    </>
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${count} filmes`}
      accessibilityState={{ selected: isSelected }}
      hitSlop={CHIP_HIT_SLOP}
      onPress={onPress}>
      {isSelected ? (
        <View className={`bg-sky ${CHIP_CLASS}`}>{content}</View>
      ) : (
        <Glass blur="sm" className={CHIP_CLASS}>
          {content}
        </Glass>
      )}
    </Pressable>
  );
}

type DirectorChipsProps = {
  directors: Director[];
  totalCount: number;
  selected: string | null;
  onSelect: (director: string | null) => void;
};

export function DirectorChips({ directors, totalCount, selected, onSelect }: DirectorChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-2 px-4">
      <DirectorChip
        testID="category-chip-all"
        label="Todos"
        count={totalCount}
        isSelected={selected === null}
        onPress={() => onSelect(null)}
      />
      {directors.map(({ name, slug, count }) => (
        <DirectorChip
          key={slug}
          testID={`category-chip-${slug}`}
          label={name}
          count={count}
          isSelected={selected === name}
          onPress={() => onSelect(selected === name ? null : name)}
        />
      ))}
    </ScrollView>
  );
}
