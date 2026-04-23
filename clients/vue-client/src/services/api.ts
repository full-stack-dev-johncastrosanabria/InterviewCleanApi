/**
 * API Client Service
 * Handles HTTP requests with proper error handling
 */

import type { ApiError } from '../types';

const API_BASE_URL = '';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Auto-inject auth token if available
    const authHeaders = this.getAuthHeaders();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      
      let data = null;
      if (contentType?.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      }

      if (!response.ok) {
        const error: ApiError = {
          message: this.extractErrorMessage(data) || 'Request failed',
          code: data?.error?.code,
          detail: data?.detail,
          title: data?.title,
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private extractErrorMessage(data: any): string {
    if (data?.error?.message) return data.error.message;
    if (data?.detail) return data.detail;
    if (data?.title) return data.title;
    if (data?.message) return data.message;
    return '';
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { API_BASE_URL };
