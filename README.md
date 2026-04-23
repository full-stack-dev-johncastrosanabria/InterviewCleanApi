# InterviewCleanApi

Clean Architecture API with .NET 10, React, and Vue clients.

## 🚀 Quick Start

**1. Start API**
```bash
cd InterviewCleanApi.Api
dotnet run
```

**2. Start React Client**
```bash
cd clients/react-client
npm install && npm run dev
```

**3. Start Vue Client**
```bash
cd clients/vue-client
npm install && npm run dev
```

**Test Credentials:** `john@test.com` / `123456`

## 🏗️ Architecture

```
InterviewCleanApi.Api/          # Presentation Layer
InterviewCleanApi.Application/  # Application Layer
InterviewCleanApi.Domain/       # Domain Layer
InterviewCleanApi.Infrastructure/ # Infrastructure Layer
clients/                        # Frontend Clients
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products (Authenticated)
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` (Admin)
- `PUT /api/products/{id}` (Admin)
- `DELETE /api/products/{id}` (Admin)

## 🛠️ Tech Stack

**Backend:** .NET 10, Entity Framework Core, JWT, SQLite

**Frontend:** React 19 / Vue 3, TypeScript, TanStack Query, Vite
