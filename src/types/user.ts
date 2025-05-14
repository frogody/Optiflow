export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
  isAdmin?: boolean;
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