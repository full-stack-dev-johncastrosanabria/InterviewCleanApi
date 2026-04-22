/**
 * Product Service
 * Handles all product-related API calls
 */

import { apiClient } from './api';
import { authService } from './authService';

export const productService = {
  /**
   * Get all products
   */
  async getAll() {
    return apiClient.get('/api/products', {
      headers: authService.getAuthHeader(),
    });
  },

  /**
   * Get product by ID
   */
  async getById(id) {
    return apiClient.get(`/api/products/${id}`, {
      headers: authService.getAuthHeader(),
    });
  },

  /**
   * Create new product
   */
  async create(productData) {
    return apiClient.post('/api/products', productData, {
      headers: authService.getAuthHeader(),
    });
  },

  /**
   * Update existing product
   */
  async update(id, productData) {
    return apiClient.put(`/api/products/${id}`, productData, {
      headers: authService.getAuthHeader(),
    });
  },

  /**
   * Delete product
   */
  async delete(id) {
    return apiClient.delete(`/api/products/${id}`, {
      headers: authService.getAuthHeader(),
    });
  },
};
