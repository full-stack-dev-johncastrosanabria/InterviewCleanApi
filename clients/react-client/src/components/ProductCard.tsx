/**
 * ProductCard Component
 * Displays individual product information
 */

import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => Promise<void>;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const handleDelete = async () => {
    if (window.confirm(`¿Eliminar "${product.name}"?`)) {
      await onDelete(product.id);
    }
  };

  return (
    <article className="product-card" data-testid="product-card">
      <div className="product-header">
        <h3 data-testid="product-name">{product.name}</h3>
        <span className="product-id">#{product.id}</span>
      </div>

      <p className="product-description" data-testid="product-description">
        {product.description || 'Sin descripción'}
      </p>

      <div className="product-details">
        <div className="detail">
          <span className="label">Precio:</span>
          <span className="value price" data-testid="product-price">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <div className="detail">
          <span className="label">Stock:</span>
          <span 
            className={`value stock ${product.stock < 10 ? 'low' : ''}`} 
            data-testid="product-stock"
          >
            {product.stock}
          </span>
        </div>
      </div>

      <button
        className="btn btn-danger"
        onClick={handleDelete}
        data-testid="delete-button"
      >
        Eliminar
      </button>
    </article>
  );
}
