import { hash, compare } from 'bcryptjs';
import { z } from 'zod';

// User schema for validation
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export type UserCredentials = z.infer<typeof userSchema>;

// Social login types
export type SocialProvider = 'github' | 'gmail';

export interface SocialLoginCredentials {
  provider: SocialProvider;
  providerToken: string;
}

// Helper functions for localStorage
const getUsers = () => {
  if (typeof window === 'undefined') return new Map();
  
  try {
    const stored = localStorage.getItem('users');
    if (!stored) {
      console.log('No users found in localStorage, creating empty map');
      return new Map();
    }
    
    // Parse the stored JSON data
    const parsed = JSON.parse(stored);
    console.log('Found users in localStorage:', parsed ? parsed.length / 2 : 0, 'users');
    return new Map(parsed);
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return new Map();
  }
};

const saveUsers = (users: Map<string, any>) => {
  if (typeof window === 'undefined') return;
  
  try {
    const data = Array.from(users.entries());
    console.log('Saving users to localStorage:', data.length, 'users');
    localStorage.setItem('users', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Create a test user for development
export async function createTestUser() {
  if (typeof window === 'undefined') return;
  
  try {
    const email = process.env.TEST_USER_EMAIL || 'demo@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'password123';
    const name = 'Demo User';
    
    const users = getUsers();
    
    // Only create test user if it doesn't exist
    if (!users.has(email)) {
      console.log('Creating test user for development');
      const hashedPassword = await hash(password, 10);
      const userId = btoa(email).slice(0, 24);
      
      const user = {
        id: userId,
        email: email,
        password: hashedPassword,
        name: name,
      };
      
      users.set(email, user);
      saveUsers(users);
      console.log('Test user created. You can login with:', email, 'and password from .env.local');
    }
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

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

export async function authenticateWithSocialProvider(provider: SocialProvider, code: string) {
  // For GitHub, we continue to use the mock implementation for now
  if (provider === 'github') {
    // Use the mock profile for GitHub
    const profile = {
      id: 'github-123456',
      email: 'github-user@example.com',
      name: 'GitHub User',
    };
    
    // Check if user already exists
    const users = getUsers();
    let user = null;
    
    // Look for existing user with this provider ID or email
    for (const existingUser of Array.from(users.values())) {
      if (existingUser.email === profile.email) {
        user = existingUser;
        break;
      }
    }
    
    // If user doesn't exist, create a new one
    if (!user) {
      const userId = `${provider}-${btoa(profile.email).slice(0, 16)}`;
      user = {
        id: userId,
        email: profile.email,
        name: profile.name,
        provider: provider,
        providerId: profile.id,
      };
      
      users.set(profile.email, user);
      saveUsers(users);
    }
    
    // Return user
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
  
  // For Gmail (Google), implement proper OAuth flow
  if (provider === 'gmail') {
    // Validate the authorization code
    if (!code || code.startsWith('mock-auth-code')) {
      throw new Error('Invalid authorization code. Please authenticate with Google.');
    }
    
    try {
      // In a real implementation, exchange the code for tokens with Google's OAuth endpoint
      // This would be a server-side operation for security
      
      // For now, we'll simulate a failure if the code doesn't look like a real Google auth code
      // This prevents the automatic access that was happening before
      if (!code.includes('google') && !code.includes('oauth')) {
        throw new Error('Invalid Google authentication. Please sign in with your Google account.');
      }
      
      // Simulate fetching the user profile from Google
      // In a real implementation, we would use the access token to get user info from Google
      const email = code.includes('@') ? code.split('@')[0] + '@gmail.com' : 'user@gmail.com';
      const profile = {
        id: `google-${Date.now()}`,
        email: email,
        name: email.split('@')[0],
      };
      
      // Check if user already exists
      const users = getUsers();
      let user = null;
      
      // Look for existing user with this email
      for (const existingUser of Array.from(users.values())) {
        if (existingUser.email === profile.email) {
          user = existingUser;
          break;
        }
      }
      
      // If user doesn't exist, create a new one
      if (!user) {
        const userId = `${provider}-${btoa(profile.email).slice(0, 16)}`;
        user = {
          id: userId,
          email: profile.email,
          name: profile.name,
          provider: provider,
          providerId: profile.id,
        };
        
        users.set(profile.email, user);
        saveUsers(users);
      }
      
      // Return user
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Google authentication error:', error);
      throw new Error('Failed to authenticate with Google. Please try again.');
    }
  }
  
  throw new Error(`Unsupported provider: ${provider}`);
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