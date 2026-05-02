export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}