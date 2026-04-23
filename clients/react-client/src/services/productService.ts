/**
 * Product Service
 * Handles all product-related API calls
 */

import { apiClient } from './api';
import { authService } from './authService';
import type { Product, ProductRequest } from '../types';

export const productService = {
  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    return apiClient.get<Product[]>('/api/products');
  },

  /**
   * Get product by ID
   */
  async getById(id: number): Promise<Product> {
    return apiClient.get<Product>(`/api/products/${id}`);
  },

  /**
   * Create new product
   */
  async create(productData: ProductRequest): Promise<Product> {
    return apiClient.post<Product>('/api/products', productData);
  },

  /**
   * Update existing product
   */
  async update(id: number, productData: ProductRequest): Promise<void> {
    return apiClient.put<void>(`/api/products/${id}`, productData);
  },

  /**
   * Delete product
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/products/${id}`);
  },
};
