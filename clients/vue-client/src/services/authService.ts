/**
 * Authentication Service
 * Handles user authentication and token management
 */

import { apiClient } from './api';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

const TOKEN_KEY = 'auth_token';

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const data: LoginRequest = { email, password };
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
    }
    
    return response;
  }

  async register(userName: string, email: string, password: string): Promise<void> {
    const data: RegisterRequest = { userName, email, password };
    await apiClient.post<void>('/api/auth/register', data);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
