/**
 * useProducts Hook
 * Manages products state and operations
 */

import { useState, useCallback, useEffect } from 'react';
import { productService } from '../services/productService';

export function useProducts(autoLoad = false) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getAll();
      setProducts(data || []);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      setProducts([]);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);

    try {
      const newProduct = await productService.create(productData);
      await loadProducts(); // Reload list
      return { success: true, data: newProduct };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);

    try {
      await productService.update(id, productData);
      await loadProducts(); // Reload list
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await productService.delete(id);
      await loadProducts(); // Reload list
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  useEffect(() => {
    if (autoLoad) {
      loadProducts();
    }
  }, [autoLoad, loadProducts]);

  return {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
