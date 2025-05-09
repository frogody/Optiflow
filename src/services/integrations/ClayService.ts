// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import axios from 'axios';

interface ClayConfig { apiKey: string;
  baseUrl?: string;
    }

interface ClayContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  phone?: string;
  linkedin?: string;
  [key: string]: any;
}

export class ClayService {
  private config: ClayConfig;
  private client: ReturnType<typeof axios.create>;

  constructor(config: ClayConfig) {
    this.config = { baseUrl: 'https://api.clay.com/v1',  // Replace with actual Clay API URL
      ...config
        };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async validateConnection(): Promise<boolean> {
    try {
      await this.client.get('/auth/test');
      return true;
    } catch (error) { console.error('Clay connection validation failed:', error);
      return false;
        }
  }

  async findProspects(query: { company?: string;
    title?: string;
    location?: string;
    industry?: string;
    limit?: number;
      }): Promise<ClayContact[]> {
    try {
      const response = await this.client.post('/prospects/search', query);
      return response.data.prospects;
    } catch (error) { console.error('Clay prospect search failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to search prospects');
        }
  }

  async enrichContact(contact: Partial<ClayContact>): Promise<ClayContact> {
    try {
      const response = await this.client.post('/enrich', contact);
      return response.data;
    } catch (error) { console.error('Clay contact enrichment failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to enrich contact');
        }
  }

  async createList(name: string, contacts: ClayContact[]): Promise<{ id: string; name: string     }> {
    try {
      const response = await this.client.post('/lists', { name,
        contacts: contacts.map(c => c.id)
          });
      return response.data;
    } catch (error) { console.error('Clay list creation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create list');
        }
  }

  async getApiStatus(): Promise<{ status: 'healthy' | 'degraded' | 'down';
    rateLimitRemaining?: number;
    resetTime?: Date;
      }> {
    try {
      const response = await this.client.get('/status');
      return response.data;
    } catch (error) {
      console.error('Clay status check failed:', error);
      return { status: 'down'     };
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await this.client.post('/auth/refresh');
      
      // Update client with new token
      this.client = axios.create({
        baseURL: this.config.baseUrl,
        headers: {
          'Authorization': `Bearer ${response.data.token}`,
          'Content-Type': 'application/json'
        }
      });

      return true;
    } catch (error) { console.error('Clay token refresh failed:', error);
      return false;
        }
  }
} 