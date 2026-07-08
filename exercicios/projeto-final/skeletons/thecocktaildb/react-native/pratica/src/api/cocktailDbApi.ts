import { DrinkDetail, DrinkSummary } from '../types/drink';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

// Fonte primária da lista — search.php?s= (vazio) é instável na key de demo,
// então usamos a categoria "Cocktail" via filter.php (100 itens, estável).
export async function fetchList(category = 'Cocktail'): Promise<DrinkSummary[]> {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  if (!res.ok) throw new Error('Falha ao carregar lista de drinks');
  const body = await res.json();
  return (body.drinks ?? []).map(
    (entry: { idDrink: string; strDrink: string; strDrinkThumb: string }) => ({
      id: entry.idDrink,
      name: entry.strDrink,
      thumbUrl: entry.strDrinkThumb,
    }),
  );
}

export async function fetchDetail(id: string): Promise<DrinkDetail> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  if (!res.ok) throw new Error(`Falha ao carregar detalhe do drink ${id}`);
  const body = await res.json();
  const d = body.drinks[0];
  return {
    id: d.idDrink,
    name: d.strDrink,
    category: d.strCategory,
    alcoholic: d.strAlcoholic,
    glass: d.strGlass,
    thumbUrl: d.strDrinkThumb,
  };
}

// Mesmo endpoint usado pra lista, só troca o valor de `c`.
export async function fetchNamesByCategory(category: string): Promise<Set<string>> {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  if (!res.ok) throw new Error(`Falha ao carregar categoria ${category}`);
  const body = await res.json();
  return new Set((body.drinks ?? []).map((entry: { strDrink: string }) => entry.strDrink));
}
