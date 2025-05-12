import { KnowledgeBase, KnowledgeDocument, Prisma } from '@prisma/client';
import { OpenAI } from 'openai';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

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

const documentMetadataSchema = z.record(z.union([z.string(), z.number(), z.boolean(), z.null()]));

const createDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
  contentType: z.enum(['text', 'markdown', 'html']).default('text'),
  metadata: documentMetadataSchema.optional(),
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

export type KnowledgeBaseWithDocuments = KnowledgeBase & {
  documents: KnowledgeDocument[];
};

export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;

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
   * Search documents across knowledge bases
   */
  async searchDocuments(params: z.infer<typeof searchDocumentsSchema>, userId: string) {
    const validatedParams = searchDocumentsSchema.parse(params);
    
    // Build the base query
    const query: Prisma.KnowledgeDocumentWhereInput = {};
    
    // Add knowledge base filters
    if (validatedParams.knowledgeBaseId) {
      query.knowledgeBaseId = validatedParams.knowledgeBaseId;
    } else {
      // If no specific knowledge base is specified, search across accessible ones
      const knowledgeBaseWhere: Prisma.KnowledgeBaseWhereInput = {};
      
      if (validatedParams.knowledgeBaseType) {
        knowledgeBaseWhere.type = validatedParams.knowledgeBaseType;
      }
      
      if (validatedParams.ownerId) {
        knowledgeBaseWhere.ownerId = validatedParams.ownerId;
      }
      
      if (validatedParams.teamId) {
        knowledgeBaseWhere.teamId = validatedParams.teamId;
      }
      
      if (validatedParams.organizationId) {
        knowledgeBaseWhere.organizationId = validatedParams.organizationId;
      }
      
      // Get accessible knowledge base IDs
      const accessibleKnowledgeBases = await prisma.knowledgeBase.findMany({
        where: {
          AND: [
            knowledgeBaseWhere,
            {
              OR: [
                { isPublic: true },
                { ownerId: userId },
                {
                  teamId: {
                    in: await this.getUserTeamIds(userId)
                  }
                },
                {
                  organizationId: {
                    in: await this.getUserOrganizationIds(userId)
                  }
                }
              ]
            }
          ]
        },
        select: { id: true }
      });
      
      query.knowledgeBaseId = {
        in: accessibleKnowledgeBases.map(kb => kb.id)
      };
    }
    
    // Use RAG service for semantic search if available
    if (this.openai) {
      try {
        const embeddingResponse = await this.openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: validatedParams.query,
        });
        const queryEmbedding = embeddingResponse.data[0].embedding;
        
        // Add vector similarity search
        // Note: This assumes your database supports vector operations
        // You might need to adjust this based on your database setup
        query.embedding = {
          similarity: {
            vector: queryEmbedding,
            threshold: 0.7
          }
        };
      } catch (error) {
        console.error('Error generating query embedding:', error);
      }
    }
    
    // Perform the search
    const documents = await prisma.knowledgeDocument.findMany({
      where: query,
      include: {
        knowledgeBase: true
      },
      take: validatedParams.limit
    });
    
    // Filter out documents user doesn't have access to
    const accessibleDocuments = await Promise.all(
      documents.map(async doc => {
        const hasAccess = await this.checkKnowledgeBaseAccess(doc.knowledgeBase, userId);
        return hasAccess ? doc : null;
      })
    );
    
    return accessibleDocuments.filter((doc): doc is KnowledgeDocument & { knowledgeBase: KnowledgeBase } => doc !== null);
  }

  /**
   * Get all knowledge bases accessible by a user
   */
  async getUserKnowledgeBases(userId: string): Promise<KnowledgeBaseWithDocuments[]> {
    return prisma.knowledgeBase.findMany({
      where: {
        OR: [
          { isPublic: true },
          { ownerId: userId },
          {
            teamId: {
              in: await this.getUserTeamIds(userId)
            }
          },
          {
            organizationId: {
              in: await this.getUserOrganizationIds(userId)
            }
          }
        ]
      },
      include: {
        documents: true
      }
    });
  }

  /**
   * Get team member role
   */
  private async getTeamMemberRole(teamId: string, userId: string): Promise<string | null> {
    const teams = await prisma.team.findMany({
      where: {
        id: teamId,
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          where: {
            userId: userId
          },
          select: {
            role: true
          }
        }
      }
    });
    
    return teams[0]?.members[0]?.role ?? null;
  }

  /**
   * Get organization member role
   */
  private async getOrganizationMemberRole(orgId: string, userId: string): Promise<string | null> {
    const orgs = await prisma.organization.findMany({
      where: {
        id: orgId,
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          where: {
            userId: userId
          },
          select: {
            role: true
          }
        }
      }
    });
    
    return orgs[0]?.members[0]?.role ?? null;
  }

  /**
   * Get all team IDs a user has access to
   */
  private async getUserTeamIds(userId: string): Promise<string[]> {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      select: {
        id: true
      }
    });
    
    return teams.map(team => team.id);
  }

  /**
   * Get all organization IDs a user has access to
   */
  private async getUserOrganizationIds(userId: string): Promise<string[]> {
    const orgs = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      select: {
        id: true
      }
    });
    
    return orgs.map(org => org.id);
  }

  // Helper methods for access control

  /**
   * Check if a user has access to a knowledge base
   */
  private async checkKnowledgeBaseAccess(
    knowledgeBase: KnowledgeBase,
    userId: string,
    accessLevel: 'read' | 'write' | 'admin' = 'read'
  ): Promise<boolean> {
    // Public knowledge bases are readable by anyone
    if (knowledgeBase.isPublic && accessLevel === 'read') {
      return true;
    }

    // Personal knowledge bases
    if (knowledgeBase.type === 'personal') {
      return knowledgeBase.ownerId === userId;
    }

    // Team knowledge bases
    if (knowledgeBase.type === 'team' && knowledgeBase.teamId) {
      const role = await this.getTeamMemberRole(knowledgeBase.teamId, userId);
      if (!role) return false;

      switch (accessLevel) {
        case 'read':
          return true; // All team members can read
        case 'write':
          return ['admin', 'editor', 'contributor'].includes(role);
        case 'admin':
          return role === 'admin';
        default:
          return false;
      }
    }

    // Organization knowledge bases
    if (knowledgeBase.type === 'organization' && knowledgeBase.organizationId) {
      const role = await this.getOrganizationMemberRole(knowledgeBase.organizationId, userId);
      if (!role) return false;

      switch (accessLevel) {
        case 'read':
          return true; // All org members can read
        case 'write':
          return ['admin', 'editor'].includes(role);
        case 'admin':
          return role === 'admin';
        default:
          return false;
      }
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
} 