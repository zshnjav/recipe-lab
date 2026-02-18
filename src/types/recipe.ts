export interface RecipeIngredientAmount {
  value: number;
  unit: string;
}

export interface RecipeIngredient {
  name: string;
  amount?: RecipeIngredientAmount;
  grams?: number;
}

export interface RecipeFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  ingredients: RecipeIngredient[];
}

export interface RecipeSummary extends RecipeFrontmatter {
  slug: string;
}

export interface Recipe extends RecipeSummary {
  body: string;
}
