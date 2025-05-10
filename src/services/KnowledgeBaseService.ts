import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { OpenAI } from 'openai';
import { RagService } from './ragService';

// Validation schemas
const createKnowledgeBaseSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['personal', 'team', 'organization']).default('personal'),
  ownerId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  isPublic: z.boolean().default(false),
});

const updateKnowledgeBaseSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

const createDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
  contentType: z.enum(['text', 'markdown', 'html']).default('text'),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  knowledgeBaseId: z.string().uuid(),
});

const searchDocumentsSchema = z.object({
  query: z.string(),
  knowledgeBaseId: z.string().uuid().optional(),
  knowledgeBaseType: z.enum(['personal', 'team', 'organization']).optional(),
  ownerId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  limit: z.number().positive().optional().default(10),
});

export class KnowledgeBaseService {
  private ragService: RagService;
  private openai: OpenAI | null = null;

  constructor() {
    this.ragService = new RagService();
    
    // Initialize OpenAI for embeddings if API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: openaiApiKey,
      });
    }
  }

  /**
   * Create a knowledge base
   */
  async createKnowledgeBase(data: z.infer<typeof createKnowledgeBaseSchema>, userId: string) {
    const validatedData = createKnowledgeBaseSchema.parse(data);
    
    // Ensure the proper ID is set based on the type
    if (validatedData.type === 'personal' && !validatedData.ownerId) {
      validatedData.ownerId = userId;
    } else if (validatedData.type === 'team' && !validatedData.teamId) {
      throw new Error('Team ID is required for team knowledge bases');
    } else if (validatedData.type === 'organization' && !validatedData.organizationId) {
      throw new Error('Organization ID is required for organization knowledge bases');
    }
    
    // Check user permissions based on knowledge base type
    if (validatedData.type === 'team' && validatedData.teamId) {
      const hasTeamAccess = await this.checkTeamAccess(validatedData.teamId, userId);
      if (!hasTeamAccess) {
        throw new Error('User does not have access to this team');
      }
    } else if (validatedData.type === 'organization' && validatedData.organizationId) {
      const hasOrgAccess = await this.checkOrganizationAccess(validatedData.organizationId, userId);
      if (!hasOrgAccess) {
        throw new Error('User does not have access to this organization');
      }
    }
    
    return prisma.knowledgeBase.create({
      data: validatedData,
    });
  }

  /**
   * Get a knowledge base by ID
   */
  async getKnowledgeBase(id: string, userId: string) {
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });
    
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found');
    }
    
    // Check access permissions
    const hasAccess = await this.checkKnowledgeBaseAccess(knowledgeBase, userId);
    if (!hasAccess) {
      throw new Error('User does not have access to this knowledge base');
    }
    
    return knowledgeBase;
  }

  /**
   * Update a knowledge base
   */
  async updateKnowledgeBase(id: string, data: z.infer<typeof updateKnowledgeBaseSchema>, userId: string) {
    const validatedData = updateKnowledgeBaseSchema.parse(data);
    
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id },
    });
    
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found');
    }
    
    // Check if user has permission to update this knowledge base
    const hasAccess = await this.checkKnowledgeBaseAccess(knowledgeBase, userId, 'write');
    if (!hasAccess) {
      throw new Error('User does not have permission to update this knowledge base');
    }
    
    return prisma.knowledgeBase.update({
      where: { id },
      data: validatedData,
    });
  }

  /**
   * Delete a knowledge base
   */
  async deleteKnowledgeBase(id: string, userId: string) {
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id },
    });
    
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found');
    }
    
    // Check if user has permission to delete this knowledge base
    const hasAccess = await this.checkKnowledgeBaseAccess(knowledgeBase, userId, 'admin');
    if (!hasAccess) {
      throw new Error('User does not have permission to delete this knowledge base');
    }
    
    return prisma.knowledgeBase.delete({
      where: { id },
    });
  }

  /**
   * Create a document in a knowledge base
   */
  async createDocument(data: z.infer<typeof createDocumentSchema>, userId: string) {
    const validatedData = createDocumentSchema.parse(data);
    
    // Check if knowledge base exists and user has access
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id: validatedData.knowledgeBaseId },
    });
    
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found');
    }
    
    const hasAccess = await this.checkKnowledgeBaseAccess(knowledgeBase, userId, 'write');
    if (!hasAccess) {
      throw new Error('User does not have permission to add documents to this knowledge base');
    }
    
    // Generate embeddings if OpenAI is configured
    let embedding = null;
    if (this.openai) {
      try {
        const embeddingResponse = await this.openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: validatedData.content,
        });
        embedding = embeddingResponse.data[0].embedding;
      } catch (error) {
        console.error('Error generating embeddings:', error);
      }
    }
    
    return prisma.knowledgeDocument.create({
      data: {
        ...validatedData,
        createdById: userId,
        embedding: embedding ? { vector: embedding } : undefined,
        tags: validatedData.tags || [],
      },
    });
  }

  /**
   * Get a document by ID
   */
  async getDocument(id: string, userId: string) {
    const document = await prisma.knowledgeDocument.findUnique({
      where: { id },
      include: {
        knowledgeBase: true,
      },
    });
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Check if user has access to the knowledge base containing this document
    const hasAccess = await this.checkKnowledgeBaseAccess(document.knowledgeBase, userId);
    if (!hasAccess) {
      throw new Error('User does not have access to this document');
    }
    
    return document;
  }

  /**
   * Update a document
   */
  async updateDocument(id: string, data: Partial<z.infer<typeof createDocumentSchema>>, userId: string) {
    const document = await prisma.knowledgeDocument.findUnique({
      where: { id },
      include: {
        knowledgeBase: true,
      },
    });
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Check if user has access to update the document
    const hasAccess = await this.checkKnowledgeBaseAccess(document.knowledgeBase, userId, 'write');
    if (!hasAccess) {
      throw new Error('User does not have permission to update this document');
    }
    
    // Generate new embeddings if content is being updated and OpenAI is configured
    let embedding = undefined;
    if (data.content && this.openai) {
      try {
        const embeddingResponse = await this.openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: data.content,
        });
        embedding = { vector: embeddingResponse.data[0].embedding };
      } catch (error) {
        console.error('Error generating embeddings:', error);
      }
    }
    
    return prisma.knowledgeDocument.update({
      where: { id },
      data: {
        ...data,
        embedding: embedding,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: string, userId: string) {
    const document = await prisma.knowledgeDocument.findUnique({
      where: { id },
      include: {
        knowledgeBase: true,
      },
    });
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Check if user has access to delete the document
    const hasAccess = await this.checkKnowledgeBaseAccess(document.knowledgeBase, userId, 'write');
    if (!hasAccess) {
      throw new Error('User does not have permission to delete this document');
    }
    
    return prisma.knowledgeDocument.delete({
      where: { id },
    });
  }

  /**
   * Search documents across knowledge bases the user has access to
   */
  async searchDocuments(params: z.infer<typeof searchDocumentsSchema>, userId: string) {
    const validatedParams = searchDocumentsSchema.parse(params);
    
    // Build query based on access level
    const query: any = {};
    
    if (validatedParams.knowledgeBaseId) {
      // Searching in a specific knowledge base
      const knowledgeBase = await prisma.knowledgeBase.findUnique({
        where: { id: validatedParams.knowledgeBaseId },
      });
      
      if (!knowledgeBase) {
        throw new Error('Knowledge base not found');
      }
      
      const hasAccess = await this.checkKnowledgeBaseAccess(knowledgeBase, userId);
      if (!hasAccess) {
        throw new Error('User does not have access to this knowledge base');
      }
      
      query.knowledgeBaseId = validatedParams.knowledgeBaseId;
    } else {
      // Searching across multiple knowledge bases based on type/ownership
      const knowledgeBaseWhere: any = {};
      
      if (validatedParams.knowledgeBaseType) {
        knowledgeBaseWhere.type = validatedParams.knowledgeBaseType;
      }
      
      if (validatedParams.ownerId) {
        knowledgeBaseWhere.ownerId = validatedParams.ownerId;
      }
      
      if (validatedParams.teamId) {
        knowledgeBaseWhere.teamId = validatedParams.teamId;
        // Verify team access
        const hasTeamAccess = await this.checkTeamAccess(validatedParams.teamId, userId);
        if (!hasTeamAccess) {
          throw new Error('User does not have access to this team');
        }
      }
      
      if (validatedParams.organizationId) {
        knowledgeBaseWhere.organizationId = validatedParams.organizationId;
        // Verify organization access
        const hasOrgAccess = await this.checkOrganizationAccess(validatedParams.organizationId, userId);
        if (!hasOrgAccess) {
          throw new Error('User does not have access to this organization');
        }
      }
      
      // Build filter for knowledge bases the user has access to
      query.knowledgeBase = {
        OR: [
          { ownerId: userId }, // Personal knowledge bases
          { teamId: { in: await this.getUserTeamIds(userId) } }, // Team knowledge bases
          { organizationId: { in: await this.getUserOrganizationIds(userId) } }, // Organization knowledge bases
          { isPublic: true }, // Public knowledge bases
        ],
        AND: knowledgeBaseWhere.length > 0 ? knowledgeBaseWhere : undefined,
      };
    }
    
    // Perform semantic search if OpenAI is configured
    if (this.openai) {
      try {
        // Generate query embedding
        const embeddingResponse = await this.openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: validatedParams.query,
        });
        const queryEmbedding = embeddingResponse.data[0].embedding;
        
        // Perform vector search in database
        // Note: This is a placeholder for vector search logic
        // Actual implementation depends on your database (e.g., using pgvector with Postgres)
        // For now, we'll use a basic text search as fallback
        
        // Fallback to basic text search
        const documents = await prisma.knowledgeDocument.findMany({
          where: {
            ...query,
            OR: [
              { title: { contains: validatedParams.query, mode: 'insensitive' } },
              { content: { contains: validatedParams.query, mode: 'insensitive' } },
              { tags: { hasSome: [validatedParams.query] } },
            ],
          },
          take: validatedParams.limit,
          orderBy: { updatedAt: 'desc' },
        });
        
        return documents;
      } catch (error) {
        console.error('Error in semantic search:', error);
      }
    }
    
    // Fallback to basic text search if OpenAI is not configured or failed
    return prisma.knowledgeDocument.findMany({
      where: {
        ...query,
        OR: [
          { title: { contains: validatedParams.query, mode: 'insensitive' } },
          { content: { contains: validatedParams.query, mode: 'insensitive' } },
          { tags: { hasSome: [validatedParams.query] } },
        ],
      },
      take: validatedParams.limit,
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get all knowledge bases a user has access to
   */
  async getUserKnowledgeBases(userId: string) {
    // Get teams and organizations the user belongs to
    const userTeamIds = await this.getUserTeamIds(userId);
    const userOrgIds = await this.getUserOrganizationIds(userId);
    
    return prisma.knowledgeBase.findMany({
      where: {
        OR: [
          { ownerId: userId }, // Personal knowledge bases
          { teamId: { in: userTeamIds } }, // Team knowledge bases
          { organizationId: { in: userOrgIds } }, // Organization knowledge bases
          { isPublic: true }, // Public knowledge bases
        ],
      },
      include: {
        _count: {
          select: { documents: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Helper methods for access control

  /**
   * Check if a user has access to a knowledge base
   */
  private async checkKnowledgeBaseAccess(
    knowledgeBase: any, 
    userId: string, 
    accessLevel: 'read' | 'write' | 'admin' = 'read'
  ): Promise<boolean> {
    // Public knowledge bases are readable by everyone
    if (accessLevel === 'read' && knowledgeBase.isPublic) {
      return true;
    }
    
    // Owner has all access levels
    if (knowledgeBase.ownerId === userId) {
      return true;
    }
    
    // Check team-based access
    if (knowledgeBase.teamId) {
      // Team owner/admin has write access, members have read access
      const teamMember = await this.getTeamMemberRole(knowledgeBase.teamId, userId);
      
      if (!teamMember) {
        return false;
      }
      
      if (accessLevel === 'admin' && teamMember !== 'admin') {
        return false;
      }
      
      if (accessLevel === 'write' && teamMember !== 'admin' && teamMember !== 'member') {
        return false;
      }
      
      return true;
    }
    
    // Check organization-based access
    if (knowledgeBase.organizationId) {
      // Org admins have write access, members have read access
      const orgMember = await this.getOrganizationMemberRole(knowledgeBase.organizationId, userId);
      
      if (!orgMember) {
        return false;
      }
      
      if (accessLevel === 'admin' && orgMember !== 'admin' && orgMember !== 'owner') {
        return false;
      }
      
      if (accessLevel === 'write' && orgMember === 'viewer') {
        return false;
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Check if a user has access to a team
   */
  private async checkTeamAccess(teamId: string, userId: string): Promise<boolean> {
    const teamMember = await this.getTeamMemberRole(teamId, userId);
    return teamMember !== null;
  }

  /**
   * Check if a user has access to an organization
   */
  private async checkOrganizationAccess(orgId: string, userId: string): Promise<boolean> {
    const orgMember = await this.getOrganizationMemberRole(orgId, userId);
    return orgMember !== null;
  }

  /**
   * Get user's role in a team
   */
  private async getTeamMemberRole(teamId: string, userId: string): Promise<string | null> {
    const orgMember = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organization: {
          teams: {
            some: {
              id: teamId,
            },
          },
        },
      },
    });
    
    if (!orgMember) {
      return null;
    }
    
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        organizationMemberId: orgMember.id,
      },
    });
    
    return teamMember ? teamMember.role : null;
  }

  /**
   * Get user's role in an organization
   */
  private async getOrganizationMemberRole(orgId: string, userId: string): Promise<string | null> {
    const orgMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: orgId,
        userId,
      },
    });
    
    return orgMember ? orgMember.role : null;
  }

  /**
   * Get all team IDs a user belongs to
   */
  private async getUserTeamIds(userId: string): Promise<string[]> {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            organizationMember: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });
    
    return teams.map(team => team.id);
  }

  /**
   * Get all organization IDs a user belongs to
   */
  private async getUserOrganizationIds(userId: string): Promise<string[]> {
    const orgs = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    
    return orgs.map(org => org.id);
  }
} 