export interface RecipeFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  ingredients: string[];
}

export interface RecipeSummary extends RecipeFrontmatter {
  slug: string;
}

export interface Recipe extends RecipeSummary {
  body: string;
}
