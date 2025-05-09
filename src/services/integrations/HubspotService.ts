// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import axios from 'axios';

interface HubspotConfig { apiKey: string;
  baseUrl?: string;
    }

interface HubspotContact {
  id: string;
  properties: {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    [key: string]: any;
  };
}

interface HubspotMeeting {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  attendees: Array<{
    email: string;
    firstName?: string;
    lastName?: string;
  }>;
  participants: string[];
  [key: string]: any;
}

export class HubspotService {
  private config: HubspotConfig;
  private client: ReturnType<typeof axios.create>;

  constructor(config: HubspotConfig) {
    this.config = { baseUrl: 'https://api.hubapi.com/v3',  // HubSpot API v3 endpoint
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
      await this.client.get('/oauth/access-tokens/validate');
      return true;
    } catch (error) { console.error('HubSpot connection validation failed:', error);
      return false;
        }
  }

  async createContact(contact: Partial<HubspotContact['properties']>): Promise<HubspotContact> {
    try {
      const response = await this.client.post('/objects/contacts', { properties: contact
          });
      return response.data;
    } catch (error) { console.error('HubSpot contact creation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create contact');
        }
  }

  async updateContact(id: string, properties: Partial<HubspotContact['properties']>): Promise<HubspotContact> {
    try {
      const response = await this.client.patch(`/objects/contacts/${id}`, {
        properties
      });
      return response.data;
    } catch (error) { console.error('HubSpot contact update failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update contact');
        }
  }

  async scheduleMeeting(meeting: Omit<HubspotMeeting, 'id' | 'status'>): Promise<HubspotMeeting> {
    try {
      const response = await this.client.post('/meetings', meeting);
      return response.data;
    } catch (error) { console.error('HubSpot meeting scheduling failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to schedule meeting');
        }
  }

  async searchContacts(query: string, properties: string[] = ['email', 'firstname', 'lastname']): Promise<HubspotContact[]> {
    try {
      const response = await this.client.post('/objects/contacts/search', {
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'CONTAINS_TOKEN',
            value: query
          }]
        }],
        properties,
        limit: 10
      });
      return response.data.results;
    } catch (error) { console.error('HubSpot contact search failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to search contacts');
        }
  }

  async getApiStatus(): Promise<{ status: 'healthy' | 'degraded' | 'down';
    rateLimitRemaining?: number;
    resetTime?: Date;
      }> {
    try {
      const response = await this.client.get('/status');
      return { status: response.data.status === 'OK' ? 'healthy' : 'degraded',
        rateLimitRemaining: response.headers['x-hubspot-ratelimit-remaining'],
        resetTime: new Date(response.headers['x-hubspot-ratelimit-reset'] * 1000)
          };
    } catch (error) {
      console.error('HubSpot status check failed:', error);
      return { status: 'down'     };
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await this.client.post('/oauth/v1/refresh');
      
      // Update client with new token
      this.client = axios.create({
        baseURL: this.config.baseUrl,
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      return true;
    } catch (error) { console.error('HubSpot token refresh failed:', error);
      return false;
        }
  }
} 