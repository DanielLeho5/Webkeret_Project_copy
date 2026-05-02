export type FoodMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodItem = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodSummary = {
  date: string;
  foods: FoodItem[];
  totals: FoodMacros;
};

export type HistoryRow = {
  date: string;
  measurements: Record<string, string>;
  foodSummary: FoodSummary;
};
