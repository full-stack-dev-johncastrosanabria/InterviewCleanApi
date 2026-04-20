<script setup>
import { onMounted, ref, computed } from "vue";

const API_BASE = "http://localhost:5000";

const token = ref(localStorage.getItem("token") ?? "");
const message = ref("");
const loadingProducts = ref(false);
const products = ref([]);

const loginForm = ref({
  email: "john@test.com",
  password: "123456",
});

const productForm = ref({
  name: "",
  description: "",
  price: "",
  stock: "",
});

const isAuthenticated = computed(() => !!token.value);

onMounted(() => {
  if (token.value) {
    loadProducts();
  }
});

async function handleLogin() {
  message.value = "";

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginForm.value),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "No se pudo iniciar sesión.");
    }

    token.value = data.token;
    localStorage.setItem("token", data.token);
    message.value = "Login correcto.";
    await loadProducts();
  } catch (error) {
    message.value = error.message;
  }
}

async function loadProducts() {
  loadingProducts.value = true;
  message.value = "";

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "No se pudieron cargar los productos.");
    }

    products.value = data;
  } catch (error) {
    message.value = error.message;
  } finally {
    loadingProducts.value = false;
  }
}

async function handleCreateProduct() {
  message.value = "";

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        name: productForm.value.name,
        description: productForm.value.description,
        price: Number(productForm.value.price),
        stock: Number(productForm.value.stock),
      }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.detail || "No se pudo crear el producto.");
    }

    productForm.value = {
      name: "",
      description: "",
      price: "",
      stock: "",
    };

    message.value = "Producto creado.";
    await loadProducts();
  } catch (error) {
    message.value = error.message;
  }
}

async function handleDeleteProduct(id) {
  message.value = "";

  try {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      throw new Error(data?.detail || "No se pudo eliminar el producto.");
    }

    message.value = "Producto eliminado.";
    await loadProducts();
  } catch (error) {
    message.value = error.message;
  }
}

function logout() {
  localStorage.removeItem("token");
  token.value = "";
  products.value = [];
  message.value = "Sesión cerrada.";
}
</script>

<template>
  <main class="page">
    <div class="card">
      <h1>Vue Client</h1>
      <p>Consume tu API de login + JWT + productos.</p>

      <form v-if="!isAuthenticated" class="form" @submit.prevent="handleLogin">
        <input v-model="loginForm.email" type="email" placeholder="Correo" />
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="Contraseña"
        />
        <button type="submit">Iniciar sesión</button>
      </form>

      <template v-else>
        <div class="toolbar">
          <button @click="loadProducts">Recargar</button>
          <button @click="logout">Cerrar sesión</button>
        </div>

        <form class="form" @submit.prevent="handleCreateProduct">
          <input v-model="productForm.name" placeholder="Nombre" />
          <input v-model="productForm.description" placeholder="Descripción" />
          <input
            v-model="productForm.price"
            type="number"
            step="0.01"
            placeholder="Precio"
          />
          <input
            v-model="productForm.stock"
            type="number"
            placeholder="Stock"
          />
          <button type="submit">Crear producto</button>
        </form>

        <section class="list">
          <h2>Productos</h2>

          <p v-if="loadingProducts">Cargando...</p>
          <p v-else-if="products.length === 0">No hay productos.</p>

          <article v-for="product in products" :key="product.id" class="item">
            <div>
              <strong>{{ product.name }}</strong>
              <p>{{ product.description || "Sin descripción" }}</p>
              <small>
                Precio: ${{ product.price }} | Stock: {{ product.stock }}
              </small>
            </div>
            <button @click="handleDeleteProduct(product.id)">Eliminar</button>
          </article>
        </section>
      </template>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}

.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 720px;
  background: #111827;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
}

.form {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #475569;
  background: #0f172a;
  color: white;
}

button {
  padding: 10px 14px;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin: 16px 0;
}

.list {
  margin-top: 20px;
}

.item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  margin-top: 12px;
  border: 1px solid #334155;
  border-radius: 12px;
  background: #0b1220;
}

.message {
  margin-top: 16px;
  color: #93c5fd;
}
</style>