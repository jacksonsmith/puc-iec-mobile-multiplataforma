// src/screens/EmptyMoviesScreen.tsx

export function EmptyMoviesScreen() {
  return (
    <div style={styles.center}>
      <p style={styles.icon}>🎬</p>
      <p style={styles.msg}>Nenhum filme para exibir ainda.</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px', textAlign: 'center' },
  icon: { fontSize: 40, margin: '0 0 8px' },
  msg: { color: '#546e7a', fontSize: 14 },
};
