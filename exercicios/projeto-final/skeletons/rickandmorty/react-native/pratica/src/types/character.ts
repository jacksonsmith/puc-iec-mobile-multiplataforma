export interface CharacterSummary {
  id: number;
  name: string;
}

export interface CharacterDetail {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

export function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}
