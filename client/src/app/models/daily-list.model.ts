export interface DailyList {
  _id: string;
  userId: string;
  categories: string[] | MeasurementCategory[]; // category IDs or populated categories
  order?: number;
  updatedAt: Date;
}

export interface MeasurementCategory {
  _id: string;
  name: string;
  unit: string;
}