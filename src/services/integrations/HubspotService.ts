import axios, { AxiosInstance } from 'axios';

interface HubspotConfig {
  apiKey: string;
  baseUrl?: string;
}

interface HubspotContactProperties {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  [key: string]: string | undefined;
}

interface HubspotContact {
  id: string;
  properties: HubspotContactProperties;
}

interface HubspotAttendee {
  email: string;
  firstName?: string;
  lastName?: string;
}

type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELED';

interface HubspotMeeting {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  status: MeetingStatus;
  attendees: HubspotAttendee[];
  participants: string[];
  [key: string]: unknown;
}

interface HubspotSearchFilter {
  propertyName: string;
  operator: 'CONTAINS_TOKEN' | 'EQ' | 'GT' | 'GTE' | 'LT' | 'LTE' | 'NEQ';
  value: string;
}

interface HubspotSearchRequest {
  filterGroups: Array<{
    filters: HubspotSearchFilter[];
  }>;
  properties: string[];
  limit: number;
}

interface HubspotSearchResponse {
  results: HubspotContact[];
  total: number;
  paging?: {
    next?: {
      link: string;
      after: string;
    };
  };
}

interface HubspotApiStatus {
  status: 'healthy' | 'degraded' | 'down';
  rateLimitRemaining?: number;
  resetTime?: Date;
}

interface HubspotTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface HubspotError extends Error {
  status?: number;
  category: 'AUTHENTICATION' | 'RATE_LIMIT' | 'VALIDATION' | 'NOT_FOUND' | 'SERVER_ERROR';
  details?: Record<string, unknown>;
}

interface HubspotResponse<T> {
  data: T;
  status: number;
  rateLimitRemaining?: number;
  requestId?: string;
}

export class HubspotService {
  private config: Required<HubspotConfig>;
  private client: AxiosInstance;

  constructor(config: HubspotConfig) {
    this.config = {
      baseUrl: 'https://api.hubapi.com/v3',  // HubSpot API v3 endpoint
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
    } catch (error) {
      console.error('HubSpot connection validation failed:', error);
      return false;
    }
  }

  async createContact(contact: Partial<HubspotContactProperties>): Promise<HubspotResponse<HubspotContact>> {
    try {
      const response = await this.client.post<HubspotContact>('/objects/contacts', {
        properties: contact
      });

      return {
        data: response.data,
        status: response.status,
        rateLimitRemaining: parseInt(response.headers['x-hubspot-ratelimit-remaining'] || '0'),
        requestId: response.headers['x-hubspot-request-id']
      };
    } catch (error) {
      console.error('HubSpot contact creation failed:', error);
      const hubspotError: HubspotError = new Error(
        error instanceof Error ? error.message : 'Failed to create contact'
      ) as HubspotError;
      
      if (axios.isAxiosError(error)) {
        hubspotError.status = error.response?.status;
        hubspotError.category = error.response?.status === 401 ? 'AUTHENTICATION' :
                               error.response?.status === 429 ? 'RATE_LIMIT' :
                               error.response?.status === 400 ? 'VALIDATION' :
                               error.response?.status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR';
        hubspotError.details = error.response?.data;
      }
      
      throw hubspotError;
    }
  }

  async updateContact(
    id: string,
    properties: Partial<HubspotContactProperties>
  ): Promise<HubspotContact> {
    try {
      const response = await this.client.patch<HubspotContact>(`/objects/contacts/${id}`, {
        properties
      });
      return response.data;
    } catch (error) {
      console.error('HubSpot contact update failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update contact');
    }
  }

  async scheduleMeeting(
    meeting: Omit<HubspotMeeting, 'id' | 'status'>
  ): Promise<HubspotMeeting> {
    try {
      const response = await this.client.post<HubspotMeeting>('/meetings', meeting);
      return response.data;
    } catch (error) {
      console.error('HubSpot meeting scheduling failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to schedule meeting');
    }
  }

  async searchContacts(
    query: string,
    properties: string[] = ['email', 'firstname', 'lastname']
  ): Promise<HubspotResponse<HubspotContact[]>> {
    try {
      const searchRequest: HubspotSearchRequest = {
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'CONTAINS_TOKEN',
            value: query
          }]
        }],
        properties,
        limit: 10
      };

      const response = await this.client.post<HubspotSearchResponse>(
        '/objects/contacts/search',
        searchRequest
      );

      return {
        data: response.data.results,
        status: response.status,
        rateLimitRemaining: parseInt(response.headers['x-hubspot-ratelimit-remaining'] || '0'),
        requestId: response.headers['x-hubspot-request-id']
      };
    } catch (error) {
      console.error('HubSpot contact search failed:', error);
      const hubspotError: HubspotError = new Error(
        error instanceof Error ? error.message : 'Failed to search contacts'
      ) as HubspotError;
      
      if (axios.isAxiosError(error)) {
        hubspotError.status = error.response?.status;
        hubspotError.category = error.response?.status === 401 ? 'AUTHENTICATION' :
                               error.response?.status === 429 ? 'RATE_LIMIT' :
                               error.response?.status === 400 ? 'VALIDATION' :
                               error.response?.status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR';
        hubspotError.details = error.response?.data;
      }
      
      throw hubspotError;
    }
  }

  async getApiStatus(): Promise<HubspotApiStatus> {
    try {
      const response = await this.client.get('/status');
      return {
        status: response.data.status === 'OK' ? 'healthy' : 'degraded',
        rateLimitRemaining: response.headers['x-hubspot-ratelimit-remaining'],
        resetTime: new Date(response.headers['x-hubspot-ratelimit-reset'] * 1000)
      };
    } catch (error) {
      console.error('HubSpot status check failed:', error);
      return {
        status: 'down'
      };
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await this.client.post<HubspotTokenResponse>('/oauth/v1/refresh');
      
      // Update client with new token
      this.client = axios.create({
        baseURL: this.config.baseUrl,
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      return true;
    } catch (error) {
      console.error('HubSpot token refresh failed:', error);
      return false;
    }
  }
} 