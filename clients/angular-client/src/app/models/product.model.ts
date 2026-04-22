/**
 * Product Model
 * Represents a product entity
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

export interface ProductResponse extends Product {}
