/**
 * ProductForm Component
 * Form for creating new products
 */

import { useState } from 'react';
import './ProductForm.css';

const initialFormState = {
  name: '',
  description: '',
  price: '',
  stock: '',
};

export function ProductForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };

    const result = await onSubmit(productData);
    
    if (result.success) {
      setFormData(initialFormState);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} data-testid="product-form">
      <h2>Crear Producto</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Nombre *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
            disabled={loading}
            data-testid="product-name-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción opcional"
            disabled={loading}
            data-testid="product-description-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Precio *</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            required
            disabled={loading}
            data-testid="product-price-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock *</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            required
            disabled={loading}
            data-testid="product-stock-input"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        data-testid="create-product-button"
      >
        {loading ? 'Creando...' : 'Crear Producto'}
      </button>
    </form>
  );
}
