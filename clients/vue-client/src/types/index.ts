/**
 * Type definitions for Vue Client
 */

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAtUtc: string;
}

export interface ProductRequest {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  code?: string;
  detail?: string;
  title?: string;
}

export interface ProductResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
