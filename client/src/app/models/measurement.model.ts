export interface Measurement {
  _id: string;
  userId: string;
  categoryId: string;
  value: number;
  date: string | Date;
  unit: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  category?: MeasurementCategory; // populated
}

export interface MeasurementCategory {
  _id: string;
  name: string;
  unit: string;
}