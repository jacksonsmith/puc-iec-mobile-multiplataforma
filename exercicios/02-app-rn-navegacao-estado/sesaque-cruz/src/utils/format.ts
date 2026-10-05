// src/utils/format.ts
//
// Formatação de dados da TMDB para exibição.

/** "2026-07-15" → "2026". Data vazia ou inválida → null. */
export const releaseYear = (date: string | null | undefined) => {
  const year = date?.slice(0, 4);
  return year && /^\d{4}$/.test(year) ? year : null;
};

/** 172 → "2h 52min"; 45 → "45min". Sem duração → null. */
export const formatRuntime = (minutes: number | null | undefined) => {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
};

/** 7.856 → "7,9" (vírgula decimal pt-BR). */
export const formatRating = (value: number) => value.toFixed(1).replace('.', ',');
