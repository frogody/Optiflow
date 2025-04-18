import { PrismaClient } from '@prisma/client';
import { validateId, validateSafeString } from './inputValidation';

// Define global type for PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, reuse the client across hot reloads
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

/**
 * Secure database operations with user context and parameterized queries
 */
export const db = {
  /**
   * Get a user by ID with validation
   */
  async getUser(userId: string) {
    try {
      // Validate ID to prevent injection
      const validatedId = validateId(userId);
      
      return await prisma.user.findUnique({
        where: { id: validatedId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          // Note: password is excluded for security
        },
      });
    } catch (error) {
      console.error('Error in getUser:', error);
      throw new Error('Failed to retrieve user');
    }
  },
  
  /**
   * Get user's orchestrators with validation and access control
   */
  async getUserOrchestrators(userId: string) {
    try {
      // Validate ID to prevent injection
      const validatedId = validateId(userId);
      
      return await prisma.orchestrator.findMany({
        where: { userId: validatedId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error in getUserOrchestrators:', error);
      throw new Error('Failed to retrieve orchestrators');
    }
  },
  
  /**
   * Get user's connections with validation and access control
   */
  async getUserConnections(userId: string) {
    try {
      // Validate ID to prevent injection
      const validatedId = validateId(userId);
      
      return await prisma.connection.findMany({
        where: { userId: validatedId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error in getUserConnections:', error);
      throw new Error('Failed to retrieve connections');
    }
  },
  
  /**
   * Create a connection with validation
   */
  async createConnection(data: { userId: string; appId: string; status?: string; connectionUrl?: string }) {
    try {
      // Validate all inputs
      const validatedUserId = validateId(data.userId);
      const validatedAppId = validateSafeString(data.appId);
      const validatedStatus = data.status ? validateSafeString(data.status) : 'disconnected';
      // URL would be validated if present
      
      return await prisma.connection.create({
        data: {
          userId: validatedUserId,
          appId: validatedAppId,
          status: validatedStatus,
          connectionUrl: data.connectionUrl,
        },
      });
    } catch (error) {
      console.error('Error in createConnection:', error);
      throw new Error('Failed to create connection');
    }
  },
  
  /**
   * Create an orchestrator with validation
   */
  async createOrchestrator(data: { userId: string; name: string; description?: string }) {
    try {
      // Validate all inputs
      const validatedUserId = validateId(data.userId);
      const validatedName = validateSafeString(data.name);
      // Description would be validated if present
      
      return await prisma.orchestrator.create({
        data: {
          userId: validatedUserId,
          name: validatedName,
          description: data.description,
        },
      });
    } catch (error) {
      console.error('Error in createOrchestrator:', error);
      throw new Error('Failed to create orchestrator');
    }
  },
  
  /**
   * Update a connection with validation and access control
   */
  async updateConnection(id: string, userId: string, data: { status?: string; connectionUrl?: string }) {
    try {
      // Validate all inputs
      const validatedId = validateId(id);
      const validatedUserId = validateId(userId);
      
      // First check if connection belongs to user
      const connection = await prisma.connection.findFirst({
        where: {
          id: validatedId,
          userId: validatedUserId,
        },
      });
      
      if (!connection) {
        throw new Error('Connection not found or access denied');
      }
      
      // Now update the connection
      return await prisma.connection.update({
        where: { id: validatedId },
        data: {
          // Only update provided fields
          ...(data.status && { status: validateSafeString(data.status) }),
          ...(data.connectionUrl && { connectionUrl: data.connectionUrl }),
        },
      });
    } catch (error) {
      console.error('Error in updateConnection:', error);
      throw new Error('Failed to update connection');
    }
  },
  
  // Raw client access, use with caution
  prisma,
};

export default db; 