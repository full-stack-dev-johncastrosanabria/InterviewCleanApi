# 🏗️ Convenciones de Arquitectura y Nombres

## ⚠️ Problema Identificado: Inconsistencia en Nombres

### ❌ Problema Actual

El proyecto tiene una **inconsistencia crítica** en el nombre de la capa de presentación:

```
❌ InterViewCleanApi/     (V mayúscula - INCORRECTO)
✅ InterviewCleanApi.Domain/
✅ InterviewCleanApi.Application/
✅ InterviewCleanApi.Infrastructure/
```

### ✅ Solución Recomendada

**Opción 1: Renombrar la carpeta (Recomendado)**
```bash
# Renombrar InterViewCleanApi → InterviewCleanApi.Api
mv InterViewCleanApi InterviewCleanApi.Api
```

**Opción 2: Mantener consistencia con el resto**
```bash
# Renombrar InterViewCleanApi → InterviewCleanApi.Presentation
mv InterViewCleanApi InterviewCleanApi.Presentation
```

---

## 📋 Convenciones de Nombres - Backend

### ✅ Estructura Correcta

```
CleanArchitectureAPI.sln
├── InterviewCleanApi.Domain/          ✅ Correcto
│   ├── Common/
│   ├── Constants/
│   ├── Entities/
│   ├── Enums/
│   ├── Errors/
│   └── Extensions/
│
├── InterviewCleanApi.Application/     ✅ Correcto
│   ├── Abstractions/
│   ├── DTOs/
│   │   ├── Auth/
│   │   └── Products/
│   └── Services/                      (vacío - correcto)
│
├── InterviewCleanApi.Infrastructure/  ✅ Correcto
│   ├── DependencyInjection/
│   ├── Migrations/
│   ├── Persistence/
│   ├── Repositories/
│   ├── Security/
│   └── Services/
│
└── InterviewCleanApi.Api/             ⚠️ Debe renombrarse
    ├── Controllers/
    ├── Middleware/
    ├── Properties/
    ├── appsettings.json
    └── Program.cs
```

### 📝 Reglas de Nombres

#### Proyectos
- **Formato:** `{ProjectName}.{Layer}`
- **Ejemplos:**
  - `InterviewCleanApi.Domain`
  - `InterviewCleanApi.Application`
  - `InterviewCleanApi.Infrastructure`
  - `InterviewCleanApi.Api` o `InterviewCleanApi.Presentation`

#### Carpetas
- **PascalCase** para todas las carpetas
- **Nombres en plural** para colecciones:
  - `Controllers/` (no `Controller/`)
  - `Services/` (no `Service/`)
  - `Repositories/` (no `Repository/`)

#### Archivos C#
- **PascalCase** para clases, interfaces, records
- **Prefijo `I`** para interfaces: `IProductService`
- **Sufijos descriptivos:**
  - `*Controller.cs` para controladores
  - `*Service.cs` para servicios
  - `*Repository.cs` para repositorios
  - `*Request.cs` / `*Response.cs` para DTOs
  - `*Extensions.cs` para extensiones

---

## 📋 Convenciones de Nombres - Frontend

### ✅ Estructura Correcta

```
clients/
├── react-client/                      ✅ Correcto
│   ├── src/
│   │   ├── components/               (nuevo)
│   │   ├── services/                 (nuevo)
│   │   ├── hooks/                    (nuevo)
│   │   ├── types/                    (nuevo)
│   │   ├── utils/                    (nuevo)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/                        (nuevo - Playwright)
│   └── package.json
│
├── angular-client/                    ✅ Correcto
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/           (nuevo)
│   │   │   ├── services/             (nuevo)
│   │   │   ├── models/               (nuevo)
│   │   │   ├── guards/               (nuevo)
│   │   │   └── app.ts
│   │   └── main.ts
│   ├── tests/                        (nuevo - Playwright)
│   └── package.json
│
└── vue-client/                        ✅ Correcto
    ├── src/
    │   ├── components/               (nuevo)
    │   ├── composables/              (nuevo)
    │   ├── services/                 (nuevo)
    │   ├── types/                    (nuevo)
    │   ├── App.vue
    │   └── main.js
    ├── tests/                        (nuevo - Playwright)
    └── package.json
```

### 📝 Reglas de Nombres - React

#### Componentes
- **PascalCase:** `ProductList.jsx`, `LoginForm.jsx`
- **Hooks personalizados:** `useAuth.js`, `useProducts.js`
- **Servicios:** `authService.js`, `productService.js`
- **Tipos:** `types.js` o `*.types.js`

#### Estructura de Archivos
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductForm.jsx
│   │   └── ProductCard.jsx
│   └── common/
│       ├── Button.jsx
│       └── Input.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   └── productService.js
├── hooks/
│   ├── useAuth.js
│   └── useProducts.js
├── types/
│   └── index.js
└── utils/
    └── constants.js
```

### 📝 Reglas de Nombres - Angular

#### Componentes
- **kebab-case:** `product-list.component.ts`
- **Servicios:** `auth.service.ts`, `product.service.ts`
- **Modelos:** `product.model.ts`, `user.model.ts`
- **Guards:** `auth.guard.ts`

#### Estructura de Archivos
```
src/app/
├── components/
│   ├── auth/
│   │   ├── login-form/
│   │   │   ├── login-form.component.ts
│   │   │   ├── login-form.component.html
│   │   │   └── login-form.component.css
│   │   └── register-form/
│   ├── products/
│   │   ├── product-list/
│   │   ├── product-form/
│   │   └── product-card/
│   └── shared/
├── services/
│   ├── api.service.ts
│   ├── auth.service.ts
│   └── product.service.ts
├── models/
│   ├── product.model.ts
│   └── user.model.ts
└── guards/
    └── auth.guard.ts
```

### 📝 Reglas de Nombres - Vue

#### Componentes
- **PascalCase:** `ProductList.vue`, `LoginForm.vue`
- **Composables:** `useAuth.js`, `useProducts.js`
- **Servicios:** `authService.js`, `productService.js`
- **Tipos:** `types.js`

#### Estructura de Archivos
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── products/
│   │   ├── ProductList.vue
│   │   ├── ProductForm.vue
│   │   └── ProductCard.vue
│   └── common/
│       ├── BaseButton.vue
│       └── BaseInput.vue
├── composables/
│   ├── useAuth.js
│   └── useProducts.js
├── services/
│   ├── api.js
│   ├── authService.js
│   └── productService.js
└── types/
    └── index.js
```

---

## 🧪 Convenciones de Nombres - Tests

### Playwright Tests

```
tests/
├── e2e/
│   ├── auth.spec.js                  ✅ Correcto
│   ├── products.spec.js              ✅ Correcto
│   └── navigation.spec.js            ✅ Correcto
├── fixtures/
│   └── test-data.js
└── playwright.config.js
```

### Reglas
- **Sufijo `.spec.js`** para archivos de test
- **Nombres descriptivos:** `auth.spec.js`, no `test1.spec.js`
- **Organización por feature:** un archivo por funcionalidad

---

## 📐 Principios de Arquitectura

### Backend (Clean Architecture)

```
┌─────────────────────────────────────┐
│         Presentation/API            │  ← Controllers, Middleware
├─────────────────────────────────────┤
│          Application                │  ← Interfaces, DTOs
├─────────────────────────────────────┤
│            Domain                   │  ← Entities, Errors, Rules
├─────────────────────────────────────┤
│        Infrastructure               │  ← Implementations
└─────────────────────────────────────┘
```

**Regla de Dependencia:** Las capas internas NO conocen las externas

### Frontend (Feature-Based)

```
src/
├── features/                         ← Por funcionalidad
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   └── products/
│       ├── components/
│       ├── services/
│       └── hooks/
├── shared/                           ← Compartido
│   ├── components/
│   ├── services/
│   └── utils/
└── core/                             ← Core (API, config)
    ├── api/
    └── config/
```

---

## ✅ Checklist de Convenciones

### Backend
- [ ] Todos los proyectos siguen `{ProjectName}.{Layer}`
- [ ] Carpetas en PascalCase
- [ ] Interfaces con prefijo `I`
- [ ] Servicios con sufijo `Service`
- [ ] Repositorios con sufijo `Repository`
- [ ] DTOs con sufijo `Request`/`Response`

### Frontend - React
- [ ] Componentes en PascalCase
- [ ] Hooks con prefijo `use`
- [ ] Servicios con sufijo `Service`
- [ ] Archivos de test con `.spec.js`

### Frontend - Angular
- [ ] Componentes en kebab-case
- [ ] Servicios con sufijo `.service.ts`
- [ ] Modelos con sufijo `.model.ts`
- [ ] Guards con sufijo `.guard.ts`

### Frontend - Vue
- [ ] Componentes en PascalCase
- [ ] Composables con prefijo `use`
- [ ] Servicios con sufijo `Service`
- [ ] Componentes base con prefijo `Base`

---

## 🔧 Acciones Correctivas Necesarias

### 1. Renombrar Proyecto de Presentación

```bash
# Opción recomendada
git mv InterViewCleanApi InterviewCleanApi.Api

# Actualizar referencias en:
# - CleanArchitectureAPI.sln
# - .csproj files
# - README.md
```

### 2. Actualizar Referencias

```xml
<!-- En CleanArchitectureAPI.sln -->
Project("{...}") = "InterviewCleanApi.Api", "InterviewCleanApi.Api\InterviewCleanApi.Api.csproj", "{...}"
```

### 3. Verificar Namespaces

```csharp
// Actualizar en todos los archivos de la capa de presentación
namespace InterviewCleanApi.Api.Controllers;
namespace InterviewCleanApi.Api.Middleware;
```

---

## 📊 Resumen de Mejoras

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Nombre del proyecto API** | InterViewCleanApi | InterviewCleanApi.Api |
| **Consistencia** | ❌ Inconsistente | ✅ Consistente |
| **Convenciones** | ❌ Parcial | ✅ Completa |
| **Arquitectura Frontend** | ❌ Monolítica | ✅ Modular |
| **Tests** | ❌ Sin tests | ✅ Playwright E2E |

---

**Fecha:** 2026-04-21  
**Versión:** 2.0  
**Estado:** 📋 Documentado - Pendiente de aplicar
