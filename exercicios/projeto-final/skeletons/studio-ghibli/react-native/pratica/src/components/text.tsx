import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';

const VARIANT_CLASS = {
  display: 'text-display font-title-800',
  'title-lg': 'text-title-lg font-title-700',
  'rail-title': 'text-rail-title font-title-700',
  'card-title': 'text-card-title font-title-700',
  original: 'text-original font-title-600',
  body: 'text-body font-text-400',
  'body-strong': 'text-body-strong font-text-700',
  meta: 'text-meta font-text-500 tabular-nums',
  label: 'text-label font-text-700',
  caption: 'text-caption font-text-700 uppercase',
};

const TONE_CLASS = {
  ink: 'text-ink',
  muted: 'text-ink-muted',
  sky: 'text-sky',
  onSky: 'text-on-sky',
  lamp: 'text-lamp',
  danger: 'text-danger',
};

export type TextProps = NativeTextProps & {
  variant?: keyof typeof VARIANT_CLASS;
  tone?: keyof typeof TONE_CLASS;
};

export function Text({ variant = 'body', tone = 'ink', className = '', ...props }: TextProps) {
  return (
    <NativeText
      className={`${VARIANT_CLASS[variant]} ${TONE_CLASS[tone]} ${className}`}
      {...props}
    />
  );
}
