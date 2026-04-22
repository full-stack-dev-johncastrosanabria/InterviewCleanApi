# InterviewCleanApi

A technical interview project built with **.NET 10** following **Clean Architecture** principles, with **three separate frontend clients** implemented in **React**, **Angular**, and **Vue**.

## 🎉 Versión 2.0 - Mejoras Implementadas

Este proyecto ha sido mejorado siguiendo las **mejores prácticas de Clean Architecture** y desarrollo .NET moderno:

✅ **Patrón Result** para manejo de errores explícito  
✅ **Repository Genérico** + **Unit of Work** para persistencia  
✅ **Errores de Dominio** centralizados y tipados  
✅ **Validación con Data Annotations** en DTOs  
✅ **Logging Estructurado** con ILogger  
✅ **Global Exception Handler** para manejo consistente de errores  
✅ **Constantes de Dominio** para valores reutilizables  
✅ **Controladores mejorados** con ProducesResponseType  
✅ **CORS mejorado** con soporte para credenciales  
✅ **Principios SOLID** aplicados en toda la arquitectura  

📚 **Documentación completa:**
- [`MEJORAS_IMPLEMENTADAS.md`](MEJORAS_IMPLEMENTADAS.md) - Resumen ejecutivo de mejoras
- [`README_IMPROVEMENTS.md`](README_IMPROVEMENTS.md) - Documentación detallada
- [`EJEMPLOS_DE_USO.md`](EJEMPLOS_DE_USO.md) - Ejemplos prácticos de código

## Overview

This project includes:

- JWT-based authentication
- Role-based authorization
- Product CRUD endpoints
- Entity Framework Core with MySQL
- Clean separation between `Domain`, `Application`, `Infrastructure`, and `API`
- Multiple frontend implementations consuming the same backend API

## Project Structure

```text
InterviewCleanApi
├── clients
│   ├── angular-client
│   ├── react-client
│   └── vue-client
├── InterViewCleanApi
├── InterviewCleanApi.Application
├── InterviewCleanApi.Domain
├── InterviewCleanApi.Infrastructure
├── CleanArchitectureAPI.sln
└── README.md
```

## Tech Stack

### Backend
- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT Bearer Authentication

### Frontend
- React 19.2.4
- Angular 21.2.0
- Vue 3.5.30

## Features

- User registration
- User login with JWT token generation
- Protected product endpoints
- Admin-only create, update, and delete operations for products
- OpenAPI enabled in development

## Architecture

### Domain
Contains core entities and enums such as:

- `AppUser`
- `Product`
- `UserRole`

### Application
Contains DTOs and contracts such as:

- `IAuthService`
- `IProductService`
- `IUserRepository`
- `IProductRepository`

### Infrastructure
Contains implementation details such as:

- `AppDbContext`
- Repository implementations
- Authentication services
- JWT token generation
- Dependency injection setup

### API
Contains:

- Controllers
- Middleware pipeline
- Authentication and authorization configuration
- CORS configuration

## Prerequisites

Before running the project, make sure you have:

- .NET 10 SDK
- MySQL running locally
- Node.js and npm
- A MySQL user with access to create and use the configured database

## Configuration

The API uses configuration from:

- `InterViewCleanApi/appsettings.json`
- `InterViewCleanApi/appsettings.Development.json`

Example connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=InterviewCleanApiDb;user=root;password=YOUR_PASSWORD;"
}
```

Example JWT settings:

```json
"Jwt": {
  "Key": "YOUR_LONG_SECRET_KEY",
  "Issuer": "InterviewCleanApi",
  "Audience": "InterviewCleanApiUsers",
  "ExpirationMinutes": 60
}
```

> Replace these values before publishing the project. Do not commit real credentials or production secrets.

## Running the API

From the solution root:

```bash
dotnet restore CleanArchitectureAPI.sln
dotnet run --project InterViewCleanApi
```

Default local URL:

- `https://localhost:5000`

## Running the Frontend Clients

### React
```bash
cd clients/react-client
npm install
npm run dev
```

### Angular
```bash
cd clients/angular-client
npm install
ng serve
```

### Vue
```bash
cd clients/vue-client
npm install
npm run dev
```

## CORS

The API currently allows local frontend development origins such as:

- `http://localhost:4200`
- `http://127.0.0.1:4200`
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5174`

## Database Migrations

To apply existing migrations:

```bash
dotnet ef database update \
  --project InterviewCleanApi.Infrastructure \
  --startup-project InterViewCleanApi
```

To create a new migration:

```bash
dotnet ef migrations add YourMigrationName \
  --project InterviewCleanApi.Infrastructure \
  --startup-project InterViewCleanApi
```

## API Endpoints

### Authentication

#### Register
- `POST /api/auth/register`

#### Login
- `POST /api/auth/login`

### Products

All product endpoints require authentication.

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` — Admin only
- `PUT /api/products/{id}` — Admin only
- `DELETE /api/products/{id}` — Admin only

## Authentication

Use the JWT token in the `Authorization` header:

```http
Authorization: Bearer your-jwt-token
```