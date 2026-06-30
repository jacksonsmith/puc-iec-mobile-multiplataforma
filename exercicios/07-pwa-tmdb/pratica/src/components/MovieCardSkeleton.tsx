// src/components/MovieCardSkeleton.tsx

import { styles } from './MovieCardSkeleton.styles';

export function MovieCardSkeleton() {
  return (
    <div style={styles.card} aria-hidden="true">
      <div style={{ ...styles.shimmer, width: 80, height: 120, borderRadius: 4, flexShrink: 0 }} />
      <div style={styles.info}>
        <div style={{ ...styles.shimmer, height: 16, width: '60%', marginBottom: 8 }} />
        <div style={{ ...styles.shimmer, height: 13, width: '30%', marginBottom: 10 }} />
        <div style={{ ...styles.shimmer, height: 13, width: '100%', marginBottom: 4 }} />
        <div style={{ ...styles.shimmer, height: 13, width: '80%' }} />
      </div>
    </div>
  );
}

const shimmerKeyframes = `
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

// Injeta keyframes uma vez
if (typeof document !== 'undefined' && !document.getElementById('skeleton-style')) {
  const style = document.createElement('style');
  style.id = 'skeleton-style';
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}
