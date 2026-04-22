# ⚛️ React Client - TypeScript + TanStack Query

Cliente React moderno con **TypeScript**, **TanStack Query**, arquitectura limpia y pruebas E2E con Playwright.

## 🏗️ Arquitectura

```
src/
├── components/          # React Components (TypeScript)
│   ├── LoginForm.tsx
│   ├── ProductForm.tsx
│   ├── ProductList.tsx
│   └── ProductCard.tsx
├── hooks/              # Custom Hooks con TanStack Query
│   ├── useAuth.ts
│   └── useProducts.ts
├── services/           # API Services
│   ├── api.ts
│   ├── authService.ts
│   └── productService.ts
├── types/              # TypeScript Types
│   └── index.ts
├── App.tsx            # Main Component
└── main.tsx           # Entry Point con QueryClient

tests/                 # Pruebas E2E con Playwright
├── auth.spec.js
├── products.spec.js
└── navigation.spec.js
```

## 🚀 Características

- ✅ **TypeScript** - Tipado fuerte y seguridad de tipos
- ✅ **TanStack Query** - Caché automático y gestión de estado del servidor
- ✅ **Clean Architecture** - Separación de responsabilidades
- ✅ **Custom Hooks** - Lógica reutilizable
- ✅ **Automatic Caching** - Datos en caché con invalidación inteligente
- ✅ **Loading States** - Estados de carga automáticos
- ✅ **Error Handling** - Manejo de errores simplificado
- ✅ **DevTools** - React Query DevTools incluidas
- ✅ **Playwright Tests** - Pruebas E2E completas
- ✅ **Responsive Design** - Mobile-first

## 📦 Instalación

```bash
npm install
npx playwright install
```

## 🏃 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Modo UI interactivo
npm run test:ui

# Modo headed (ver navegador)
npm run test:headed
```

## 🏗️ Build

```bash
npm run build
npm run preview
```

## 📝 Uso

### TanStack Query Hooks

```typescript
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';

function MyComponent() {
  const { isAuthenticated, login, logout } = useAuth();
  const { 
    products, 
    loading, 
    createProduct, 
    deleteProduct,
    isCreating 
  } = useProducts();
  
  // Automatic caching, refetching, and state management!
}
```

### Servicios con TypeScript

```typescript
import { authService } from './services/authService';
import { productService } from './services/productService';

// Login
await authService.login('email@test.com', 'password');

// Get products (con tipos)
const products: Product[] = await productService.getAll();

// Create product
await productService.create({ 
  name: 'Product', 
  price: 10, 
  stock: 5 
});
```

## 🎨 Componentes

### LoginForm
Formulario de autenticación con validación y TypeScript

### ProductForm
Formulario para crear productos con tipos

### ProductList
Lista de productos con grid responsive

### ProductCard
Tarjeta individual de producto con acciones

## 🔥 Beneficios de TanStack Query

### Antes (sin TanStack Query)
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const loadProducts = async () => {
  setLoading(true);
  try {
    const data = await productService.getAll();
    setProducts(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadProducts();
}, []);
```

### Después (con TanStack Query)
```typescript
const { 
  products, 
  loading, 
  error 
} = useProducts();

// ¡Eso es todo! Caché, refetch, loading states automáticos
```

### Comparación

| Característica | Sin TanStack Query | Con TanStack Query |
|----------------|-------------------|-------------------|
| **Código** | ~50 líneas | ~10 líneas |
| **Caché** | Manual | ✅ Automático |
| **Loading** | Manual useState | ✅ Automático |
| **Error** | Manual try/catch | ✅ Automático |
| **Refetch** | Manual | ✅ Automático |
| **DevTools** | ❌ No | ✅ Sí |

## 🧪 Cobertura de Tests

- ✅ Autenticación (login, logout, persistencia)
- ✅ CRUD de productos (crear, listar, eliminar)
- ✅ Validación de formularios
- ✅ Navegación y flujo completo
- ✅ Responsive design

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env`:

```env
VITE_API_URL=http://localhost:5000
```

### TanStack Query Config

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## 📚 Tecnologías

- React 19.2.4
- TypeScript 5.7.3
- TanStack Query 5.62.11
- Vite 8.0.0
- Playwright 1.49.1

## 🎯 Mejores Prácticas

- ✅ TypeScript strict mode
- ✅ TanStack Query para estado del servidor
- ✅ Custom hooks para lógica reutilizable
- ✅ Servicios para API calls
- ✅ Componentes pequeños y enfocados
- ✅ Data attributes para testing
- ✅ CSS Modules para estilos
- ✅ Error handling consistente
- ✅ Tipos explícitos en todas partes

## 📖 Documentación

Ver [CONVENCIONES_ARQUITECTURA.md](../../CONVENCIONES_ARQUITECTURA.md) para más detalles sobre la arquitectura del proyecto.

---

**Versión:** 3.0.0  
**Framework:** React 19 + TypeScript  
**Estado Management:** TanStack Query  
**Estado:** ✅ Producción Ready
