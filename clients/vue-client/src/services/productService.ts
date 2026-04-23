/**
 * Product Service
 * Handles product CRUD operations
 */

import { apiClient } from './api';
import { authService } from './authService';
import type { Product, ProductRequest } from '../types';

class ProductService {
  private getHeaders(): Record<string, string> {
    return authService.getAuthHeader();
  }

  async getAll(): Promise<Product[]> {
    return apiClient.get<Product[]>('/api/products');
  }

  async getById(id: number): Promise<Product> {
    return apiClient.get<Product>(`/api/products/${id}`);
  }

  async create(product: ProductRequest): Promise<Product> {
    return apiClient.post<Product>('/api/products', product);
  }

  async update(id: number, product: ProductRequest): Promise<void> {
    return apiClient.put<void>(`/api/products/${id}`, product);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/products/${id}`);
  }
}

export const productService = new ProductService();
