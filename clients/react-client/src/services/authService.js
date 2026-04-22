/**
 * Authentication Service
 * Handles login, register, and token management
 */

import { apiClient } from './api';

const TOKEN_KEY = 'auth_token';

export const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });

    if (response?.token) {
      this.setToken(response.token);
    }

    return response;
  },

  /**
   * Register new user
   */
  async register(userName, email, password) {
    await apiClient.post('/api/auth/register', {
      userName,
      email,
      password,
    });
  },

  /**
   * Logout user
   */
  logout() {
    this.removeToken();
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Store token
   */
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Remove token
   */
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Get authorization header
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
