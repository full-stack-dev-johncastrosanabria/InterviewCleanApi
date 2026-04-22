# 🚀 Guía de Instalación - Vue Client

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Backend corriendo en `http://localhost:5000`

## Instalación

### 1. Instalar Dependencias

```bash
cd clients/vue-client
npm install
```

Esto instalará:
- Vue 3.5.30
- TypeScript 5.7.3
- TanStack Query 5.62.11
- Vite 8.0.0
- Playwright 1.49.1

### 2. Instalar Playwright (Primera vez)

```bash
npx playwright install
```

Esto descargará los navegadores necesarios para los tests E2E.

### 3. Configurar Variables de Entorno (Opcional)

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000
```

Si no se configura, usará `http://localhost:5000` por defecto.

## Desarrollo

### Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5174**

### Características del Servidor de Desarrollo

- ⚡ Hot Module Replacement (HMR)
- 🔄 Recarga automática al guardar
- 🎯 TypeScript type checking
- 📦 Vite optimizado

## Build para Producción

### Compilar

```bash
npm run build
```

Esto ejecutará:
1. `vue-tsc` - Type checking de TypeScript
2. `vite build` - Build optimizado

Los archivos compilados estarán en `dist/`

### Preview del Build

```bash
npm run preview
```

Sirve el build de producción localmente para verificar.

## Testing

### Ejecutar Tests E2E

```bash
# Todos los tests
npm test

# Con UI interactiva
npm run test:ui

# Con navegador visible
npm run test:headed
```

### Tests Disponibles

**auth.spec.ts** (5 tests):
- Login con credenciales válidas
- Login con credenciales inválidas
- Logout
- Persistencia de autenticación
- Display de formulario de login

**products.spec.ts** (8 tests):
- Display de formulario de productos
- Display de lista de productos
- Crear producto
- Limpiar formulario después de crear
- Eliminar producto
- Recargar productos
- Validar campos requeridos
- Display de detalles de producto

## Estructura del Proyecto

```
src/
├── components/          # Componentes Vue
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
├── types/               # Tipos TypeScript
│   └── index.ts
├── App.vue              # Componente principal
├── main.ts              # Punto de entrada
└── style.css            # Estilos globales
```

## Solución de Problemas

### Error: Cannot find module

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: Playwright no instalado

```bash
npx playwright install
```

### Error: Puerto 5174 en uso

Cambiar puerto en `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 5175, // Cambiar a otro puerto
  },
});
```

### Error: API no responde

Verificar que el backend esté corriendo:

```bash
cd InterViewCleanApi
dotnet run
```

Debe estar en `http://localhost:5000`

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm run preview` | Preview del build |
| `npm test` | Ejecuta tests E2E |
| `npm run test:ui` | Tests con UI interactiva |
| `npm run test:headed` | Tests con navegador visible |

## Credenciales de Prueba

Para probar la aplicación, usar:

- **Email:** `john@test.com`
- **Password:** `123456`

Estas credenciales están pre-configuradas en el backend.

## Tecnologías

- **Vue 3.5** - Framework progresivo
- **TypeScript 5.7** - Tipado estático
- **TanStack Query 5.62** - Gestión de estado del servidor
- **Vite 8.0** - Build tool ultra rápido
- **Playwright 1.49** - Testing E2E

## Recursos

- [Vue 3 Docs](https://vuejs.org/)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/vue/overview)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)
- [Playwright Docs](https://playwright.dev/)

## Soporte

Para más información, consultar:
- `README.md` - Documentación completa
- `../GUIA_MIGRACION_TYPESCRIPT_TANSTACK.md` - Guía de migración
- `../VUE_MIGRACION_COMPLETADA.md` - Detalles de la migración

---

**Versión:** 2.0.0  
**Estado:** ✅ Listo para usar
