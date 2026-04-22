/**
 * ProductList Component
 * Displays list of products with delete functionality
 */

import { ProductCard } from './ProductCard';
import './ProductList.css';

export function ProductList({ products, loading, onDelete }) {
  if (loading) {
    return (
      <div className="product-list" data-testid="product-list">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list" data-testid="product-list">
        <div className="empty-state">
          <p>No hay productos disponibles</p>
          <small>Crea tu primer producto usando el formulario arriba</small>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list" data-testid="product-list">
      <h2>Productos ({products.length})</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
