/**
 * Authentication Service
 * Handles login, register, and token management
 */

import { apiClient } from './api';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

const TOKEN_KEY = 'auth_token';

export const authService = {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const request: LoginRequest = { email, password };
    const response = await apiClient.post<LoginResponse>('/api/auth/login', request);

    if (response?.token) {
      this.setToken(response.token);
    }

    return response;
  },

  /**
   * Register new user
   */
  async register(userName: string, email: string, password: string): Promise<void> {
    const request: RegisterRequest = { userName, email, password };
    await apiClient.post<void>('/api/auth/register', request);
  },

  /**
   * Logout user
   */
  logout(): void {
    this.removeToken();
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Store token
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Remove token
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Get authorization header
   */
  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
