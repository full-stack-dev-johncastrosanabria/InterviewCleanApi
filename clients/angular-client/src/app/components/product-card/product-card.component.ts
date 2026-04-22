/**
 * Product Card Component
 * Displays individual product information
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() delete = new EventEmitter<number>();

  onDelete(): void {
    if (confirm(`¿Eliminar "${this.product.name}"?`)) {
      this.delete.emit(this.product.id);
    }
  }
}
