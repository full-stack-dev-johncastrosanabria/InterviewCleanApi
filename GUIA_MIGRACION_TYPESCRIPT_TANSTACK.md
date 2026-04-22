# 🚀 Guía de Migración a TypeScript + TanStack Query

## 📋 Estado Actual

### ✅ Completado
- **Backend:** Clean Architecture con Result Pattern
- **React Client:** JavaScript con hooks y servicios
- **Angular Client:** TypeScript con Services y RxJS

### ⏳ Pendiente
1. Vue Client mejorado
2. React → TypeScript + TanStack Query
3. Vue → TypeScript + TanStack Query

---

## 🎯 Plan de Migración

### Fase 1: Vue Client (JavaScript)
### Fase 2: React → TypeScript + TanStack Query
### Fase 3: Vue → TypeScript + TanStack Query

---

## 📦 Fase 1: Vue Client Mejorado

### Estructura

```
src/
├── components/
│   ├── LoginForm.vue
│   ├── ProductForm.vue
│   ├── ProductList.vue
│   └── ProductCard.vue
├── composables/
│   ├── useAuth.js
│   └── useProducts.js
├── services/
│   ├── api.js
│   ├── authService.js
│   └── productService.js
├── types/
│   └── index.js
└── App.vue
```

### Archivos Clave

#### `src/services/api.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    
    let data = null;
    if (contentType?.includes('application/json')) {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    }

    if (!response.ok) {
      throw new Error(data?.error?.message || data?.detail || 'Request failed');
    }

    return data;
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

#### `src/composables/useAuth.js`
```javascript
import { ref, computed } from 'vue';
import { authService } from '../services/authService';

const isAuthenticated = ref(authService.isAuthenticated());
const loading = ref(false);
const error = ref(null);

export function useAuth() {
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;

    try {
      await authService.login(email, password);
      isAuthenticated.value = true;
      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    authService.logout();
    isAuthenticated.value = false;
    error.value = null;
  };

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    login,
    logout,
  };
}
```

---

## 📦 Fase 2: React → TypeScript + TanStack Query

### 1. Instalar Dependencias

```bash
cd clients/react-client
npm install @tanstack/react-query
npm install -D typescript @types/react @types/react-dom
```

### 2. Configurar TypeScript

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Crear Tipos

#### `src/types/index.ts`
```typescript
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAtUtc: string;
}

export interface ProductRequest {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
```

### 4. Migrar Servicios a TypeScript

#### `src/services/api.ts`
```typescript
import { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      
      let data = null;
      if (contentType?.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      }

      if (!response.ok) {
        const error: ApiError = {
          message: data?.error?.message || data?.detail || data?.title || 'Request failed',
          code: data?.error?.code
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { API_BASE_URL };
```

### 5. Configurar TanStack Query

#### `src/main.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### 6. Crear Hooks con TanStack Query

#### `src/hooks/useProducts.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { Product, ProductRequest } from '../types';

export function useProducts() {
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (product: ProductRequest) => productService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products,
    isLoading,
    error,
    refetch,
    createProduct: createMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
```

#### `src/hooks/useAuth.ts`
```typescript
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginRequest) => 
      authService.login(email, password),
    onSuccess: () => {
      setIsAuthenticated(true);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ userName, email, password }: RegisterRequest) =>
      authService.register(userName, email, password),
  });

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
```

### 7. Actualizar Componentes

#### `src/components/ProductList.tsx`
```typescript
import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onDelete: (id: number) => Promise<void>;
}

export function ProductList({ products, loading, onDelete }: ProductListProps) {
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
```

### 8. Actualizar package.json

```json
{
  "name": "react-client",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.62.11",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@playwright/test": "^1.49.1",
    "@tanstack/react-query-devtools": "^5.62.11",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.0",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "typescript": "^5.7.3",
    "vite": "^8.0.0"
  }
}
```

---

## 📦 Fase 3: Vue → TypeScript + TanStack Query

### 1. Instalar Dependencias

```bash
cd clients/vue-client
npm install @tanstack/vue-query
npm install -D typescript @vue/tsconfig vue-tsc
```

### 2. Configurar TypeScript

#### `tsconfig.json`
```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Configurar TanStack Query

#### `src/main.ts`
```typescript
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import './style.css';

const app = createApp(App);

app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  },
});

app.mount('#app');
```

### 4. Crear Composables con TanStack Query

#### `src/composables/useProducts.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { productService } from '../services/productService';
import type { Product, ProductRequest } from '../types';

export function useProducts() {
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (product: ProductRequest) => productService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: computed(() => products.value || []),
    isLoading,
    error,
    refetch,
    createProduct: createMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: computed(() => createMutation.isPending.value),
    isDeleting: computed(() => deleteMutation.isPending.value),
  };
}
```

### 5. Actualizar package.json

```json
{
  "name": "vue-client",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed"
  },
  "dependencies": {
    "@tanstack/vue-query": "^5.62.11",
    "vue": "^3.5.30"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.1",
    "@vitejs/plugin-vue": "^6.0.5",
    "@vue/tsconfig": "^0.7.0",
    "typescript": "^5.7.3",
    "vite": "^8.0.0",
    "vue-tsc": "^2.2.0"
  }
}
```

---

## 🎯 Beneficios de TanStack Query

### ✅ Ventajas

1. **Caché Automático** - Datos en caché con invalidación inteligente
2. **Loading States** - Estados de carga automáticos
3. **Error Handling** - Manejo de errores simplificado
4. **Refetch** - Refetch automático en focus/reconexión
5. **Optimistic Updates** - Actualizaciones optimistas
6. **DevTools** - Herramientas de desarrollo incluidas
7. **TypeScript** - Soporte completo de tipos

### 📊 Comparación

| Característica | Sin TanStack Query | Con TanStack Query |
|----------------|-------------------|-------------------|
| **Caché** | Manual | ✅ Automático |
| **Loading** | Manual useState | ✅ Automático |
| **Error** | Manual try/catch | ✅ Automático |
| **Refetch** | Manual | ✅ Automático |
| **DevTools** | ❌ No | ✅ Sí |
| **Código** | ~100 líneas | ~30 líneas |

---

## 📝 Checklist de Migración

### React → TypeScript + TanStack Query
- [ ] Instalar dependencias
- [ ] Configurar tsconfig.json
- [ ] Crear tipos (types/index.ts)
- [ ] Migrar servicios a .ts
- [ ] Configurar QueryClient
- [ ] Migrar hooks a TanStack Query
- [ ] Migrar componentes a .tsx
- [ ] Actualizar tests
- [ ] Verificar build

### Vue → TypeScript + TanStack Query
- [ ] Instalar dependencias
- [ ] Configurar tsconfig.json
- [ ] Crear tipos (types/index.ts)
- [ ] Migrar servicios a .ts
- [ ] Configurar VueQueryPlugin
- [ ] Migrar composables a TanStack Query
- [ ] Migrar componentes a .vue con <script setup lang="ts">
- [ ] Actualizar tests
- [ ] Verificar build

---

## 🚀 Comandos Útiles

```bash
# React
cd clients/react-client
npm install
npm run dev
npm run build
npm test

# Vue
cd clients/vue-client
npm install
npm run dev
npm run build
npm test

# Angular (ya completado)
cd clients/angular-client
npm install
npm start
npm run build
npm test
```

---

**Fecha:** 2026-04-21  
**Versión:** 3.0  
**Estado:** 📋 Guía Completa
