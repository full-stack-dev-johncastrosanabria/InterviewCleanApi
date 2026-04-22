<script setup lang="ts">
import { ref } from 'vue';
import { useProducts } from '../composables/useProducts';

const { createProduct, isCreating } = useProducts();

const name = ref('');
const description = ref('');
const price = ref('');
const stock = ref('');
const message = ref('');
const error = ref('');

const handleSubmit = async () => {
  message.value = '';
  error.value = '';

  const result = await createProduct({
    name: name.value,
    description: description.value || null,
    price: Number(price.value),
    stock: Number(stock.value),
  });

  if (result.success) {
    message.value = 'Producto creado exitosamente';
    // Reset form
    name.value = '';
    description.value = '';
    price.value = '';
    stock.value = '';
  } else {
    error.value = result.error || 'Failed to create product';
  }
};
</script>

<template>
  <form class="product-form" @submit.prevent="handleSubmit" data-testid="product-form">
    <h2>Crear Producto</h2>

    <div class="form-group">
      <input
        v-model="name"
        type="text"
        placeholder="Nombre del producto"
        required
        data-testid="product-name"
      />
    </div>

    <div class="form-group">
      <input
        v-model="description"
        type="text"
        placeholder="Descripción (opcional)"
        data-testid="product-description"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <input
          v-model="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio"
          required
          data-testid="product-price"
        />
      </div>

      <div class="form-group">
        <input
          v-model="stock"
          type="number"
          min="0"
          placeholder="Stock"
          required
          data-testid="product-stock"
        />
      </div>
    </div>

    <button 
      type="submit" 
      :disabled="isCreating"
      data-testid="create-button"
    >
      {{ isCreating ? 'Creando...' : 'Crear Producto' }}
    </button>

    <p v-if="message" class="success" data-testid="success-message">
      {{ message }}
    </p>

    <p v-if="error" class="error" data-testid="error-message">
      {{ error }}
    </p>
  </form>
</template>

<style scoped>
.product-form {
  background: #111827;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.product-form h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #e2e8f0;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #475569;
  background: #0f172a;
  color: white;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #10b981;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #059669;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  margin-top: 12px;
  color: #10b981;
  font-size: 14px;
}

.error {
  margin-top: 12px;
  color: #ef4444;
  font-size: 14px;
}
</style>
