export interface DailyFoodList {
  id: string;
  userId: string;
  date: Date;
  foods: FoodItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g., 'g', 'ml', 'pieces'
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}