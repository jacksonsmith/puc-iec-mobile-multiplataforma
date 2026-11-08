import { Pressable, type PressableProps } from 'react-native';

import { Text } from './text';

const VARIANT_CLASS = {
  primary: 'bg-sky px-6',
  quiet: 'px-3',
};

type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: keyof typeof VARIANT_CLASS;
};

export function Button({ label, variant = 'primary', ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-12 items-center justify-center rounded-full active:opacity-70 ${VARIANT_CLASS[variant]}`}
      {...props}>
      <Text variant="body-strong" tone={variant === 'primary' ? 'onSky' : 'sky'}>
        {label}
      </Text>
    </Pressable>
  );
}
