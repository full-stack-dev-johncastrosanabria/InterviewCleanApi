# InterviewCleanApi

Clean Architecture API with .NET 10, React, and Vue clients.

## 🚀 Quick Start

```bash
# Start API
cd InterviewCleanApi.Api
dotnet run

# Start React Client (in new terminal)
cd clients/react-client
npm install && npm run dev

# Start Vue Client (in new terminal)
cd clients/vue-client
npm install && npm run dev
```

**Test Credentials:** `john@test.com` / `123456`

## 📖 Documentation

- **[PROJECT_SETUP.md](PROJECT_SETUP.md)** - Complete setup guide, troubleshooting, and architecture
- **[DOCS_INDEX.md](DOCS_INDEX.md)** - Full documentation index

See all available documentation in [DOCS_INDEX.md](DOCS_INDEX.md).

## 🌐 URLs

- **API:** http://localhost:5000
- **React Client:** http://localhost:5173
- **Vue Client:** http://localhost:5174

## 🏗️ Architecture

```
InterviewCleanApi.Api/          # Presentation Layer
InterviewCleanApi.Application/  # Application Layer
InterviewCleanApi.Domain/       # Domain Layer
InterviewCleanApi.Infrastructure/ # Infrastructure Layer
clients/                        # Frontend Clients
```

## ✨ Features

- Clean Architecture with SOLID principles
- JWT Authentication
- Result Pattern for error handling
- TanStack Query for data fetching
- Vite proxy for CORS-free development
- TypeScript with full type safety
- Responsive UI with professional themes

## 📝 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products (Authenticated)
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` (Admin)
- `PUT /api/products/{id}` (Admin)
- `DELETE /api/products/{id}` (Admin)

## 🛠️ Tech Stack

**Backend:**
- .NET 10
- Entity Framework Core
- JWT Bearer Authentication
- SQLite

**Frontend:**
- React 19 + TypeScript
- Vue 3 + TypeScript
- TanStack Query
- Vite

## ✅ Status

All systems operational and fully functional.
