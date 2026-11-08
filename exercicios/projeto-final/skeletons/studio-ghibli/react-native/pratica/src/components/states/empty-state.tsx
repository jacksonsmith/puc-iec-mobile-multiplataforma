import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { Button } from '../button';
import { Glass } from '../glass';
import { Text } from '../text';
import { useBrandTokens } from '../use-brand-tokens';

type EmptyStateProps = {
  testID: string;
  icon: SymbolViewProps['name'];
  iconColor?: 'ink-muted' | 'lamp';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  testID,
  icon,
  iconColor = 'ink-muted',
  title,
  message,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  const tokens = useBrandTokens();

  return (
    <Glass
      testID={testID}
      variant="strong"
      blur="lg"
      className={`gap-1 rounded-lg p-4 ${className}`}>
      <SymbolView name={icon} size={24} tintColor={tokens.color(iconColor)} />
      <Text variant="body-strong" className="mt-2">
        {title}
      </Text>
      <Text variant="meta" tone="muted">
        {message}
      </Text>
      {actionLabel && onAction && <Button variant="quiet" label={actionLabel} onPress={onAction} />}
    </Glass>
  );
}
