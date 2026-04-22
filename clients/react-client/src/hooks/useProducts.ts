/**
 * useProducts Hook with TanStack Query
 * Manages products state and operations with automatic caching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { Product, ProductRequest, ProductResult } from '../types';

export function useProducts() {
  const queryClient = useQueryClient();

  // Query for fetching products
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  // Mutation for creating products
  const createMutation = useMutation({
    mutationFn: (product: ProductRequest) => productService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Mutation for updating products
  const updateMutation = useMutation({
    mutationFn: ({ id, product }: { id: number; product: ProductRequest }) =>
      productService.update(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Mutation for deleting products
  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Wrapper functions with error handling
  const createProduct = async (productData: ProductRequest): Promise<ProductResult<Product>> => {
    try {
      const data = await createMutation.mutateAsync(productData);
      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      return { success: false, error: message };
    }
  };

  const updateProduct = async (id: number, productData: ProductRequest): Promise<ProductResult> => {
    try {
      await updateMutation.mutateAsync({ id, product: productData });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      return { success: false, error: message };
    }
  };

  const deleteProduct = async (id: number): Promise<ProductResult> => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      return { success: false, error: message };
    }
  };

  return {
    products,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    loadProducts: refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
