export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  settings?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
  organization?: {
    id: string;
    name: string;
    role: string;
  };
} 