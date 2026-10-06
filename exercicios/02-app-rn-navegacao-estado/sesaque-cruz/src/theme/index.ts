// src/theme/index.ts
//
// Design tokens do app. Telas e componentes usam só esses valores,
// pra manter cor, espaçamento e tipografia consistentes.

export const colors = {
  background: '#F5F6F8',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF0F3',
  border: '#E3E6EA',
  text: '#14171C',
  textMuted: '#6B7280',
  primary: '#E11D48',
  primarySoft: '#FFE4E9',
  rating: '#F59E0B',
  ratingSoft: '#FEF3C7',
  ratingText: '#92400E',
  overlay: 'rgba(20, 23, 28, 0.55)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  heading: { fontSize: 17, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  caption: { fontSize: 13, lineHeight: 18, color: colors.textMuted },
  label: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
} as const;

export const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;
