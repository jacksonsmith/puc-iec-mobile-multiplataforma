export interface DrinkSummary {
  id: string;
  name: string;
  thumbUrl: string;
}

export interface DrinkDetail {
  id: string;
  name: string;
  category: string;
  alcoholic: string;
  glass: string;
  thumbUrl: string;
}

export function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}
