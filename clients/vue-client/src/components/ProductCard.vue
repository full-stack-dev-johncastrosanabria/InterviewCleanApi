<script setup lang="ts">
import type { Product } from '../types';

interface Props {
  product: Product;
}

interface Emits {
  (e: 'delete', id: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleDelete = (id: number) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    emit('delete', id);
  }
};
</script>

<template>
  <article class="product-card" :data-testid="`product-${product.id}`">
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">
        {{ product.description || 'Sin descripción' }}
      </p>
      <div class="product-details">
        <span class="product-price" data-testid="product-price">
          ${{ product.price.toFixed(2) }}
        </span>
        <span class="product-stock" data-testid="product-stock">
          Stock: {{ product.stock }}
        </span>
      </div>
    </div>
    <button 
      class="delete-button" 
      @click="handleDelete(product.id)"
      :data-testid="`delete-${product.id}`"
    >
      Eliminar
    </button>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #0b1220;
  border: 1px solid #334155;
  border-radius: 12px;
  transition: border-color 0.2s;
}

.product-card:hover {
  border-color: #475569;
}

.product-info {
  flex: 1;
}

.product-name {
  margin: 0 0 8px 0;
  color: #e2e8f0;
  font-size: 18px;
  font-weight: 600;
}

.product-description {
  margin: 0 0 12px 0;
  color: #94a3b8;
  font-size: 14px;
}

.product-details {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.product-price {
  color: #10b981;
  font-weight: 600;
}

.product-stock {
  color: #94a3b8;
}

.delete-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #ef4444;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.delete-button:hover {
  background: #dc2626;
}
</style>
