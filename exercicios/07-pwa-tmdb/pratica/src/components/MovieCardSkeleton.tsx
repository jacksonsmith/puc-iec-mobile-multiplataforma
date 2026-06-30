// src/components/MovieCardSkeleton.tsx

export function MovieCardSkeleton() {
  return (
    <article style={styles.card}>
      <div style={{ ...styles.shimmer, width: 80, height: 120, borderRadius: 4, flexShrink: 0 }} />
      <div style={styles.info}>
        <div style={{ ...styles.shimmer, height: 16, width: '60%', marginBottom: 8 }} />
        <div style={{ ...styles.shimmer, height: 13, width: '30%', marginBottom: 10 }} />
        <div style={{ ...styles.shimmer, height: 13, width: '100%', marginBottom: 4 }} />
        <div style={{ ...styles.shimmer, height: 13, width: '80%' }} />
      </div>
    </article>
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

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    gap: 16,
    padding: 16,
    borderRadius: 8,
    background: '#1c2d40',
    marginBottom: 12,
  },
  info: { flex: 1, minWidth: 0 },
  shimmer: {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #1c2d40 25%, #2a3f55 50%, #1c2d40 75%)',
    backgroundSize: '800px 100%',
    animation: 'shimmer 1.4s infinite linear',
  },
};
