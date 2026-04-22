# 🎯 Vue Client - Clean Architecture + TypeScript + TanStack Query

Cliente Vue 3 con arquitectura limpia, TypeScript y TanStack Query para gestión de estado del servidor.

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── LoginForm.vue
│   ├── ProductForm.vue
│   ├── ProductList.vue
│   └── ProductCard.vue
├── composables/         # Composables con TanStack Query
│   ├── useAuth.ts
│   └── useProducts.ts
├── services/            # Servicios de API
│   ├── api.ts
│   ├── authService.ts
│   └── productService.ts
├── types/               # Definiciones TypeScript
│   └── index.ts
├── App.vue              # Componente principal
└── main.ts              # Punto de entrada
```

## ✨ Características

### 🎨 Vue 3 Composition API
- **Script Setup**: Sintaxis moderna y concisa
- **TypeScript**: Tipado fuerte en toda la aplicación
- **Reactive State**: Reactividad nativa de Vue

### 🔄 TanStack Query
- **Caché Automático**: Los datos se cachean por 5 minutos
- **Invalidación Inteligente**: Refetch automático después de mutaciones
- **Loading States**: Estados de carga automáticos
- **Error Handling**: Manejo de errores simplificado
- **Optimistic Updates**: Actualizaciones optimistas

### 🏛️ Clean Architecture
- **Separación de Responsabilidades**: Componentes, composables y servicios separados
- **Reutilización**: Componentes y composables reutilizables
- **Testeable**: Arquitectura fácil de testear
- **Mantenible**: Código organizado y escalable

### 🧪 Testing
- **Playwright**: Tests E2E completos
- **8 Test Suites**: Cobertura de auth y productos
- **Data Test IDs**: Selectores estables para tests

## 📦 Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Vue | 3.5.30 | Framework UI |
| TypeScript | 5.7.3 | Tipado estático |
| TanStack Query | 5.62.11 | Gestión de estado del servidor |
| Vite | 8.0.0 | Build tool |
| Playwright | 1.49.1 | Testing E2E |

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Instalar Playwright (primera vez)
npx playwright install
```

## 💻 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en http://localhost:5174
```

## 🏗️ Build

```bash
# Build para producción (con type checking)
npm run build

# Preview del build
npm run preview
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo UI
npm run test:ui

# Ejecutar tests con navegador visible
npm run test:headed
```

## 📁 Estructura de Archivos

### Componentes

#### `LoginForm.vue`
Formulario de autenticación con validación.

```vue
<script setup lang="ts">
import { useAuth } from '../composables/useAuth';

const { login, isLoggingIn } = useAuth();
</script>
```

#### `ProductForm.vue`
Formulario para crear productos con validación de campos.

#### `ProductList.vue`
Lista de productos con estados de carga y vacío.

#### `ProductCard.vue`
Tarjeta individual de producto con botón de eliminar.

### Composables

#### `useAuth.ts`
Gestión de autenticación con TanStack Query.

```typescript
export function useAuth() {
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => 
      authService.login(email, password),
    onSuccess: () => {
      isAuthenticated.value = true;
    },
  });

  return {
    isAuthenticated,
    login,
    logout,
    isLoggingIn,
  };
}
```

#### `useProducts.ts`
Gestión de productos con TanStack Query.

```typescript
export function useProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (product) => productService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products,
    isLoading,
    createProduct: createMutation.mutateAsync,
  };
}
```

### Servicios

#### `api.ts`
Cliente HTTP genérico con manejo de errores.

```typescript
class ApiClient {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Implementación con fetch
  }
}
```

#### `authService.ts`
Servicio de autenticación con gestión de tokens.

```typescript
class AuthService {
  async login(email: string, password: string): Promise<LoginResponse>
  async register(userName: string, email: string, password: string): Promise<void>
  logout(): void
  isAuthenticated(): boolean
}
```

#### `productService.ts`
Servicio CRUD de productos.

```typescript
class ProductService {
  async getAll(): Promise<Product[]>
  async create(product: ProductRequest): Promise<Product>
  async delete(id: number): Promise<void>
}
```

## 🎯 TanStack Query - Beneficios

### Antes (Sin TanStack Query)

```typescript
// ~120 líneas de código
const products = ref([]);
const loading = ref(false);
const error = ref(null);

const loadProducts = async () => {
  loading.value = true;
  try {
    const data = await productService.getAll();
    products.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
```

### Después (Con TanStack Query)

```typescript
// ~40 líneas de código
const { data: products, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: () => productService.getAll(),
});
```

### Ventajas

✅ **70% menos código**  
✅ **Caché automático** - No más requests duplicados  
✅ **Estados automáticos** - loading, error, success  
✅ **Refetch inteligente** - Actualización automática  
✅ **Invalidación** - Sincronización después de mutaciones  

## 🔧 Configuración

### Variables de Entorno

Crear `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000
```

### TanStack Query Config

```typescript
// main.ts
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  },
});
```

## 📊 Comparación con React y Angular

| Característica | Vue | React | Angular |
|---------------|-----|-------|---------|
| **Sintaxis** | `<script setup>` | JSX | TypeScript |
| **Estado** | Composition API | Hooks | RxJS |
| **Reactividad** | Nativa | Manual | RxJS |
| **Tipado** | TypeScript | TypeScript | TypeScript |
| **Query** | TanStack Query | TanStack Query | RxJS |
| **Tests** | Playwright | Playwright | Playwright |

## 🧪 Tests E2E

### Cobertura

- ✅ Login con credenciales válidas
- ✅ Login con credenciales inválidas
- ✅ Logout
- ✅ Persistencia de autenticación
- ✅ Crear producto
- ✅ Eliminar producto
- ✅ Recargar productos
- ✅ Validación de formularios

### Ejemplo de Test

```typescript
test('should create a new product', async ({ page }) => {
  await page.getByTestId('product-name').fill('Test Product');
  await page.getByTestId('product-price').fill('99.99');
  await page.getByTestId('product-stock').fill('10');
  await page.getByTestId('create-button').click();

  await expect(page.getByTestId('success-message')).toBeVisible();
  await expect(page.getByText('Test Product')).toBeVisible();
});
```

## 🎨 Estilos

- **Scoped Styles**: Estilos encapsulados por componente
- **Dark Theme**: Tema oscuro moderno
- **Responsive**: Diseño adaptable a móviles
- **CSS Grid**: Layout moderno con Grid

## 🔐 Autenticación

- **JWT Tokens**: Almacenados en localStorage
- **Bearer Auth**: Headers automáticos en requests
- **Persistencia**: Sesión persiste después de reload
- **Logout**: Limpieza completa de estado

## 📝 Tipos TypeScript

```typescript
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  createdAtUtc: string;
}

interface ProductRequest {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
}
```

## 🚀 Despliegue

```bash
# Build
npm run build

# Los archivos estarán en dist/
# Servir con cualquier servidor estático
```

## 📚 Recursos

- [Vue 3 Docs](https://vuejs.org/)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/vue/overview)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Playwright Docs](https://playwright.dev/)

## 🎯 Próximos Pasos

- [ ] Agregar paginación de productos
- [ ] Implementar búsqueda y filtros
- [ ] Agregar edición de productos
- [ ] Implementar registro de usuarios
- [ ] Agregar tests unitarios con Vitest

---

**Versión:** 2.0.0  
**Framework:** Vue 3 + TypeScript + TanStack Query  
**Arquitectura:** Clean Architecture  
**Estado:** ✅ Completado
