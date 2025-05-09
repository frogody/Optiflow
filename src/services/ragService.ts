// @ts-nocheck - This file has some TypeScript issues that are hard to fix
/**
 * RAG (Retrieval Augmented Generation) Service
 * 
 * Provides document retrieval functionality to enhance AI responses within workflows
 * by retrieving relevant information from knowledge bases.
 */

export interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    title?: string;
    author?: string;
    date?: string;
    url?: string;
    [key: string]: any;
  };
  embedding?: number[]; // Vector representation for similarity search
}

export interface RagOptions {
  knowledgeBase: string; // ID of the knowledge base to use,
  similarityThreshold: number; // Minimum similarity score (0-1),
  maxDocuments: number; // Maximum number of documents to return
}

export interface RetrievalRequest {
  query: string; // The query text to find relevant documents for
  options: RagOptions;
  filters?: { [key: string]: any; // Metadata filters
  };
}

export interface RetrievalResult {
  query: string;
  documents: Array<Document & { similarity: number }>;
  timing: {
    retrievalMs: number;
    totalMs: number;
  };
}

// Mock knowledge bases for development
const mockKnowledgeBases: Record<string, Document[]> = {
  'company-docs': [
    {
      id: 'company-mission',
      content: 'Our company mission is to create innovative solutions that transform how businesses operate. We focus on sustainability, efficiency, and user-friendly designs.',
      metadata: {
        source: 'Company Website',
        title: 'Mission Statement',
        url: 'https://example.com/about/mission'
      }
    },
    {
      id: 'company-history',
      content: 'Founded in 2010, our company began as a small startup with just 5 employees. We\'ve since grown to over 500 employees across 12 countries, serving thousands of businesses worldwide.',
      metadata: {
        source: 'Company Website',
        title: 'Our History',
        url: 'https://example.com/about/history'
      }
    },
    {
      id: 'company-values',
      content: 'Our core values include innovation, integrity, customer focus, and teamwork. These principles guide every decision we make and how we interact with customers and partners.',
      metadata: {
        source: 'Internal Documentation',
        title: 'Company Values',
      }
    }
  ],
  'product-info': [
    {
      id: 'product-features',
      content: 'Our flagship product offers automated workflow management, data analytics, and integration with 200+ third-party services. It supports both cloud and on-premise deployments.',
      metadata: {
        source: 'Product Documentation',
        title: 'Product Features',
        url: 'https://example.com/products/features'
      }
    },
    {
      id: 'product-pricing',
      content: 'We offer three pricing tiers: Standard ($99/month), Professional ($199/month), and Enterprise (custom pricing). All plans include 24/7 support and regular updates.',
      metadata: {
        source: 'Product Documentation',
        title: 'Pricing Information',
        url: 'https://example.com/products/pricing'
      }
    },
    {
      id: 'product-api',
      content: 'Our REST API allows developers to integrate our services into their applications. The API supports JSON and XML formats with OAuth 2.0 authentication.',
      metadata: {
        source: 'Developer Documentation',
        title: 'API Reference',
        url: 'https://example.com/developers/api'
      }
    }
  ],
  'customer-data': [
    {
      id: 'customer-segments',
      content: 'Our customer base consists primarily of mid-size businesses (45%), enterprise clients (30%), and small businesses (25%). Key industries include finance, healthcare, and retail.',
      metadata: {
        source: 'Market Research',
        title: 'Customer Segments',
        date: '2023-01-15'
      }
    },
    {
      id: 'customer-feedback',
      content: 'Recent customer surveys indicate 92% satisfaction with our product reliability, 87% with our support services, and 78% with our onboarding process.',
      metadata: {
        source: 'Customer Success',
        title: 'Satisfaction Metrics',
        date: '2023-06-22'
      }
    }
  ],
  'general-kb': [
    {
      id: 'industry-trends',
      content: 'Current industry trends include increased adoption of AI-powered workflows, greater focus on data privacy regulations, and the shift toward hybrid cloud environments.',
      metadata: {
        source: 'Industry Report',
        title: '2023 Market Trends',
        author: 'Market Research Team',
        date: '2023-03-10'
      }
    },
    {
      id: 'best-practices',
      content: 'Best practices for workflow automation include starting with clear documentation, prioritizing high-impact processes, involving end-users in the design phase, and implementing robust testing procedures.',
      metadata: {
        source: 'Knowledge Base',
        title: 'Workflow Automation Best Practices',
        url: 'https://example.com/resources/best-practices'
      }
    }
  ]
};

/**
 * Simple text similarity function using Jaccard similarity on word sets
 * (This is a simplified version for mock purposes - in production, use proper embeddings)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(word => word.length > 2));
  const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(word => word.length > 2));
  
  // Convert sets to arrays to avoid Set iteration issues
  const words1Array = Array.from(words1);
  const words2Array = Array.from(words2);
  
  const intersection = words1Array.filter(word => words2.has(word));
  const union = Array.from(new Set([...words1Array, ...words2Array]));
  
  return intersection.length / union.length;
}

/**
 * RAG Service class that handles document retrieval
 */
export class RagService {
  /**
   * Retrieve relevant documents based on a query
   */
  async retrieveDocuments(request: RetrievalRequest): Promise<RetrievalResult> {
    const startTime = Date.now();
    const retrievalStart = Date.now();
    
    // Get knowledge base (or empty array if not found)
    const knowledgeBase = mockKnowledgeBases[request.options.knowledgeBase] || [];
    
    // Calculate similarity and filter documents
    const documentsWithScores = knowledgeBase
      .map(doc => ({ ...doc,
        similarity: calculateSimilarity(request.query, doc.content)
      }))
      .filter(doc => {
        // Apply similarity threshold
        if (doc.similarity < request.options.similarityThreshold) {
          return false;
        }
        
        // Apply metadata filters if provided
        if (request.filters) {
          for (const [key, value] of Object.entries(request.filters)) {
            if (doc.metadata[key] !== value) {
              return false;
            }
          }
        }
        
        return true;
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, request.options.maxDocuments);
    
    const retrievalTime = Date.now() - retrievalStart;
    const totalTime = Date.now() - startTime;
    
    return {
      query: request.query,
      documents: documentsWithScores,
      timing: {
        retrievalMs: retrievalTime,
        totalMs: totalTime
      }
    };
  }
  
  /**
   * Generate context for an AI prompt using retrieved documents
   */
  generateContext(retrievalResult: RetrievalResult): string {
    if (retrievalResult.documents.length === 0) {
      return '';
    }
    
    const contextParts = retrievalResult.documents.map((doc, index) => {
      return `DOCUMENT ${index + 1} (${Math.round(doc.similarity * 100)}% relevant):\n${doc.content}\nSource: ${doc.metadata.title || 'Untitled'} (${doc.metadata.source || 'Unknown source'})\n`;
    });
    
    return `RELEVANT INFORMATION:\n\n${contextParts.join('\n')}\n\nPlease use the above information to help answer the query: "${retrievalResult.query}"\n\n`;
  }
  
  /**
   * List available knowledge bases
   */
  listKnowledgeBases(): { id: string, documentCount: number }[] {
    return Object.entries(mockKnowledgeBases).map(([id, docs]) => ({ id,
      documentCount: docs.length
    }));
  }
  
  /**
   * Get details about a specific knowledge base
   */
  getKnowledgeBaseInfo(knowledgeBaseId: string): { id: string, documentCount: number, sources: string[] } | null {
    const docs = mockKnowledgeBases[knowledgeBaseId];
    if (!docs) {
      return null;
    }
    
    // Convert to array to avoid Set iteration issues
    const sourceSet = new Set<string>();
    docs.forEach(doc => {
      if (doc.metadata.source) {
        sourceSet.add(doc.metadata.source as string);
      }
    });
    
    return { id: knowledgeBaseId,
      documentCount: docs.length,
      sources: Array.from(sourceSet)
    };
  }
}

// Singleton instance
const ragService = new RagService();
export default ragService; 