# 🅰️ Angular Client - Clean Architecture

Cliente Angular moderno con arquitectura limpia, servicios separados, componentes standalone y pruebas E2E con Playwright.

## 🏗️ Arquitectura

```
src/app/
├── components/          # Standalone Components
│   ├── login-form/
│   ├── product-form/
│   ├── product-list/
│   └── product-card/
├── services/           # Injectable Services
│   ├── api.service.ts
│   ├── auth.service.ts
│   └── product.service.ts
├── models/             # TypeScript Interfaces
│   ├── auth.model.ts
│   └── product.model.ts
├── app.ts             # Main Component
└── app.config.ts      # App Configuration

tests/                 # Pruebas E2E con Playwright
├── auth.spec.ts
└── products.spec.ts
```

## 🚀 Características

- ✅ **Clean Architecture** - Separación de responsabilidades
- ✅ **Standalone Components** - Sin NgModules
- ✅ **Services con RxJS** - Programación reactiva
- ✅ **TypeScript** - Tipado fuerte
- ✅ **Signals Ready** - Preparado para Angular Signals
- ✅ **Playwright Tests** - Pruebas E2E completas
- ✅ **Responsive Design** - Mobile-first

## 📦 Instalación

```bash
npm install
npx playwright install
```

## 🏃 Desarrollo

```bash
npm start
```

Abre [http://localhost:4200](http://localhost:4200)

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
```

## 📝 Uso

### Services

```typescript
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';

constructor(
  private authService: AuthService,
  private productService: ProductService
) {}

// Login
this.authService.login('email@test.com', 'password').subscribe({
  next: (response) => console.log('Logged in'),
  error: (error) => console.error(error)
});

// Get products
this.productService.getAll().subscribe({
  next: (products) => console.log(products),
  error: (error) => console.error(error)
});
```

### Components

```typescript
// Standalone component
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-component.html',
  styleUrl: './my-component.css'
})
export class MyComponent {}
```

## 🎨 Componentes

### LoginFormComponent
Formulario de autenticación con validación

### ProductFormComponent
Formulario para crear productos

### ProductListComponent
Lista de productos con grid responsive

### ProductCardComponent
Tarjeta individual de producto con acciones

## 🧪 Cobertura de Tests

- ✅ Autenticación (login, logout, persistencia)
- ✅ CRUD de productos (crear, listar, eliminar)
- ✅ Validación de formularios
- ✅ Navegación y flujo completo
- ✅ Responsive design

## 🔧 Configuración

### Environments

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'
};
```

## 📚 Tecnologías

- Angular 21.2.0
- RxJS 7.8.0
- TypeScript 5.9.2
- Playwright 1.49.1

## 🎯 Mejores Prácticas

- ✅ Standalone components (sin NgModules)
- ✅ Services con RxJS para estado reactivo
- ✅ TypeScript strict mode
- ✅ Componentes pequeños y enfocados
- ✅ Data attributes para testing
- ✅ CSS encapsulado por componente
- ✅ Error handling con RxJS operators

## 📖 Documentación

Ver [CONVENCIONES_ARQUITECTURA.md](../../CONVENCIONES_ARQUITECTURA.md) para más detalles sobre la arquitectura del proyecto.

---

**Versión:** 2.0.0  
**Framework:** Angular 21  
**Estado:** ✅ Producción Ready
