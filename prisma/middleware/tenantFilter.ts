/**
 * Prisma middleware for multi-tenant data security
 * 
 * This middleware automatically applies tenant-based filtering to queries
 * to ensure data isolation between different organizations and users.
 * It enforces row-level security based on the user's context.
 */

import { Prisma } from '@prisma/client';

/**
 * Context interface for tenant filtering
 */
export interface TenantContext {
  userId?: string | null;
  organizationId?: string | null;
  teamId?: string | null;
  includePublic?: boolean;
  isAdmin?: boolean;
}

/**
 * Models that have tenant-specific fields
 */
export enum TenantModel {
  Workflow = 'Workflow',
  AIPrompt = 'AIPrompt',
  AITrainingData = 'AITrainingData',
  KnowledgeBase = 'KnowledgeBase',
  KnowledgeDocument = 'KnowledgeDocument',
  ApiKey = 'ApiKey',
  Comment = 'Comment',
  VoiceAnalytics = 'VoiceAnalytics',
  VoiceInteraction = 'VoiceInteraction'
}

/**
 * Mapping of models to their tenant-specific fields
 */
const MODEL_TENANT_FIELDS: Record<string, string[]> = {
  [TenantModel.Workflow]: ['organizationId', 'createdById', 'teamId'],
  [TenantModel.AIPrompt]: ['userId', 'organizationId'],
  [TenantModel.AITrainingData]: ['userId', 'organizationId'],
  [TenantModel.KnowledgeBase]: ['ownerId', 'teamId', 'organizationId'],
  [TenantModel.KnowledgeDocument]: ['createdById', 'knowledgeBaseId'],
  [TenantModel.ApiKey]: ['userId'],
  [TenantModel.Comment]: ['userId'],
  [TenantModel.VoiceAnalytics]: ['userId'],
  [TenantModel.VoiceInteraction]: ['userId']
};

/**
 * Mapping of models to their "public" field (if available)
 */
const MODEL_PUBLIC_FIELDS: Record<string, string> = {
  [TenantModel.Workflow]: 'isPublic',
  [TenantModel.AIPrompt]: 'isPublic',
  [TenantModel.KnowledgeBase]: 'isPublic'
};

/**
 * Creates the tenant filter middleware
 * 
 * @param tenantContext - The tenant context for filtering
 * @returns A Prisma middleware function
 */
export function createTenantMiddleware(tenantContext: TenantContext) {
  return async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>,
  ): Promise<any> => {
    // Skip middleware for non-database operations or if admin
    if (params.action === 'queryRaw' || params.action === 'executeRaw' || tenantContext.isAdmin === true) {
      return next(params);
    }

    // Get the model name from the params
    const modelName = params.model;
    
    // If this is not a tenant-filtered model, proceed without filtering
    if (!modelName || !MODEL_TENANT_FIELDS[modelName]) {
      return next(params);
    }

    // Apply tenant filters based on operation type
    if (['findUnique', 'findFirst', 'findMany', 'count', 'aggregate'].includes(params.action)) {
      // Clone params for modification
      const modifiedParams = { ...params };

      // Create tenant filter conditions
      const tenantFilter = createTenantFilter(modelName, tenantContext);
      
      if (tenantFilter) {
        // For findUnique, convert to findFirst with added tenant conditions
        if (params.action === 'findUnique') {
          modifiedParams.action = 'findFirst';
          modifiedParams.args.where = {
            AND: [
              params.args.where,
              tenantFilter
            ]
          };
        } else {
          // For other read operations, add tenant filter to existing where clause
          modifiedParams.args.where = modifiedParams.args.where || {};
          modifiedParams.args.where = {
            AND: [
              modifiedParams.args.where,
              tenantFilter
            ]
          };
        }
      }

      // Execute with modified params
      return next(modifiedParams);
    }

    // For create operations, ensure tenant IDs are set
    if (params.action === 'create') {
      // Ensure organization ID is set
      if (MODEL_TENANT_FIELDS[modelName].includes('organizationId') && tenantContext.organizationId) {
        params.args.data.organizationId = params.args.data.organizationId || tenantContext.organizationId;
      }

      // Ensure user ID is set
      if (MODEL_TENANT_FIELDS[modelName].includes('userId') || 
          MODEL_TENANT_FIELDS[modelName].includes('createdById')) {
        const field = MODEL_TENANT_FIELDS[modelName].includes('userId') ? 'userId' : 'createdById';
        if (tenantContext.userId) {
          params.args.data[field] = params.args.data[field] || tenantContext.userId;
        }
      }

      // Ensure team ID is set if applicable
      if (MODEL_TENANT_FIELDS[modelName].includes('teamId') && tenantContext.teamId) {
        params.args.data.teamId = params.args.data.teamId || tenantContext.teamId;
      }
    }

    // For update/delete operations, ensure tenant isolation
    if (['update', 'updateMany', 'delete', 'deleteMany'].includes(params.action)) {
      const tenantFilter = createTenantFilter(modelName, tenantContext);
      
      if (tenantFilter) {
        // Clone params for modification
        const modifiedParams = { ...params };
        
        // For single record operations, convert to many with added tenant conditions
        if (params.action === 'update') {
          modifiedParams.action = 'updateMany';
          modifiedParams.args.where = {
            AND: [
              { id: params.args.where.id },
              tenantFilter
            ]
          };
        } else if (params.action === 'delete') {
          modifiedParams.action = 'deleteMany';
          modifiedParams.args.where = {
            AND: [
              { id: params.args.where.id },
              tenantFilter
            ]
          };
        } else {
          // For many record operations, add tenant filter
          modifiedParams.args.where = {
            AND: [
              modifiedParams.args.where || {},
              tenantFilter
            ]
          };
        }
        
        // Execute with modified params
        const result = await next(modifiedParams);
        
        // For converted operations, adjust the return format
        if (params.action === 'update' || params.action === 'delete') {
          if (result.count === 0) {
            throw new Error(`No ${modelName} record found with the specified ID or you don't have permission to access it`);
          }
          
          // For update, fetch the updated record to return
          if (params.action === 'update') {
            const updatedRecord = await (params.model as any).findUnique({
              where: { id: params.args.where.id },
              ...params.args.select ? { select: params.args.select } : {},
              ...params.args.include ? { include: params.args.include } : {}
            });
            
            if (!updatedRecord) {
              throw new Error(`No ${modelName} record found after update`);
            }
            
            return updatedRecord;
          }
          
          // For delete, return 1 deleted count
          return { count: 1 };
        }
        
        return result;
      }
    }

    return next(params);
  };
}

/**
 * Creates a tenant filter condition for queries
 * 
 * @param modelName - The model being queried
 * @param context - The tenant context
 * @returns A where condition object or null
 */
function createTenantFilter(modelName: string, context: TenantContext): any {
  const { userId, organizationId, teamId, includePublic } = context;
  const tenantFields = MODEL_TENANT_FIELDS[modelName];
  const publicField = MODEL_PUBLIC_FIELDS[modelName];
  
  // No context provided, no filtering
  if (!userId && !organizationId && !teamId) {
    return null;
  }
  
  // Build OR conditions for tenant access
  const conditions = [];
  
  // User ownership condition
  if (userId && (tenantFields.includes('userId') || tenantFields.includes('createdById'))) {
    if (tenantFields.includes('userId')) {
      conditions.push({ userId });
    }
    if (tenantFields.includes('createdById')) {
      conditions.push({ createdById: userId });
    }
  }
  
  // Organization ownership condition
  if (organizationId && tenantFields.includes('organizationId')) {
    conditions.push({ organizationId });
  }
  
  // Team ownership condition
  if (teamId && tenantFields.includes('teamId')) {
    conditions.push({ teamId });
  }
  
  // Public access condition (if requested)
  if (includePublic && publicField) {
    conditions.push({ [publicField]: true });
  }
  
  // KnowledgeDocument special case - check ownership through knowledgeBase
  if (modelName === TenantModel.KnowledgeDocument) {
    const knowledgeBaseConditions = [];
    
    if (userId) {
      knowledgeBaseConditions.push({ knowledgeBase: { ownerId: userId } });
    }
    
    if (organizationId) {
      knowledgeBaseConditions.push({ knowledgeBase: { organizationId } });
    }
    
    if (teamId) {
      knowledgeBaseConditions.push({ knowledgeBase: { teamId } });
    }
    
    if (includePublic) {
      knowledgeBaseConditions.push({ knowledgeBase: { isPublic: true } });
    }
    
    if (knowledgeBaseConditions.length > 0) {
      conditions.push({ OR: knowledgeBaseConditions });
    }
  }
  
  // If we have conditions, create an OR filter
  if (conditions.length > 0) {
    return { OR: conditions };
  }
  
  return null;
} 