/**
 * Product Service
 * Handles all product-related API calls
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Product, ProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getAll(): Observable<Product[]> {
    return this.apiService.get<Product[]>(
      '/api/products',
      this.authService.getAuthHeaders()
    );
  }

  getById(id: number): Observable<Product> {
    return this.apiService.get<Product>(
      `/api/products/${id}`,
      this.authService.getAuthHeaders()
    );
  }

  create(product: ProductRequest): Observable<Product> {
    return this.apiService.post<Product>(
      '/api/products',
      product,
      this.authService.getAuthHeaders()
    );
  }

  update(id: number, product: ProductRequest): Observable<void> {
    return this.apiService.put<void>(
      `/api/products/${id}`,
      product,
      this.authService.getAuthHeaders()
    );
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(
      `/api/products/${id}`,
      this.authService.getAuthHeaders()
    );
  }
}
