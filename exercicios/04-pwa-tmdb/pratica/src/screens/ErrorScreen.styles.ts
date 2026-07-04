import type React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: 24 },
  card: { maxWidth: 440, background: '#1c2d40', borderRadius: 12, padding: 32, textAlign: 'center' },
  icon: { fontSize: 40, margin: '0 0 12px' },
  title: { color: '#e57373', margin: '0 0 12px', fontSize: 20 },
  message: { color: '#cfd8dc', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px', wordBreak: 'break-word' },
  hint: { color: '#90a4ae', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 },
  link: { color: '#01b4e4' },
  btn: { background: '#01b4e4', color: '#0d253f', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
};
