<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../types';
import ProductCard from './ProductCard.vue';

interface Props {
  products: Product[];
  loading: boolean;
}

interface Emits {
  (e: 'delete', id: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isEmpty = computed(() => !props.loading && props.products.length === 0);
</script>

<template>
  <section class="product-list" data-testid="product-list">
    <h2>Productos ({{ products.length }})</h2>

    <div v-if="loading" class="loading">
      Cargando productos...
    </div>

    <div v-else-if="isEmpty" class="empty-state">
      <p>No hay productos disponibles</p>
      <small>Crea tu primer producto usando el formulario arriba</small>
    </div>

    <div v-else class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @delete="emit('delete', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.product-list {
  background: #111827;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
}

.product-list h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #e2e8f0;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.empty-state small {
  font-size: 14px;
  color: #64748b;
}

.product-grid {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
