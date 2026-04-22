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
    return apiClient.get<Product[]>('/api/products', {
      headers: this.getHeaders(),
    });
  }

  async getById(id: number): Promise<Product> {
    return apiClient.get<Product>(`/api/products/${id}`, {
      headers: this.getHeaders(),
    });
  }

  async create(product: ProductRequest): Promise<Product> {
    return apiClient.post<Product>('/api/products', product, {
      headers: this.getHeaders(),
    });
  }

  async update(id: number, product: ProductRequest): Promise<void> {
    return apiClient.put<void>(`/api/products/${id}`, product, {
      headers: this.getHeaders(),
    });
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/products/${id}`, {
      headers: this.getHeaders(),
    });
  }
}

export const productService = new ProductService();
