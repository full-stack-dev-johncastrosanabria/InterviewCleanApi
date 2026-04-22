/**
 * Product Form Component
 * Form for creating new products
 */

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  @Output() productSubmit = new EventEmitter<ProductRequest>();

  name = '';
  description = '';
  price: number | null = null;
  stock: number | null = null;
  loading = false;

  onSubmit(): void {
    if (this.name && this.price !== null && this.stock !== null) {
      const product: ProductRequest = {
        name: this.name,
        description: this.description || null,
        price: this.price,
        stock: this.stock
      };

      this.loading = true;
      this.productSubmit.emit(product);
    }
  }

  reset(): void {
    this.name = '';
    this.description = '';
    this.price = null;
    this.stock = null;
    this.loading = false;
  }

  setLoading(loading: boolean): void {
    this.loading = loading;
  }
}
