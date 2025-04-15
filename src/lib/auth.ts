import { hash, compare } from 'bcryptjs';
import { z } from 'zod';

// User schema for validation
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export type UserCredentials = z.infer<typeof userSchema>;

// Helper functions for localStorage
const getUsers = () => {
  if (typeof window === 'undefined') return new Map();
  const stored = localStorage.getItem('users');
  return stored ? new Map(JSON.parse(stored)) : new Map();
};

const saveUsers = (users: Map<string, any>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('users', JSON.stringify(Array.from(users.entries())));
};

export async function registerUser(credentials: UserCredentials) {
  const validated = userSchema.parse(credentials);
  const users = getUsers();
  
  if (users.has(validated.email)) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hash(validated.password, 10);
  const userId = btoa(validated.email).slice(0, 24);

  const user = {
    id: userId,
    email: validated.email,
    password: hashedPassword,
    name: validated.name,
  };

  users.set(validated.email, user);
  saveUsers(users);

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function authenticateUser(email: string, password: string) {
  const users = getUsers();
  const user = users.get(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await compare(password, user.password);
  
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getUserById(id: string) {
  const users = getUsers();
  for (const user of Array.from(users.values())) {
    if (user.id === id) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }
  return null;
} 