# InterviewCleanApi

Clean Architecture API with .NET 10, React, and Vue clients.

## 🚀 Quick Start

### Prerequisites
- .NET 10 SDK
- Node.js 18+

### Start the Application

**1. Start API (Required First)**
```bash
cd InterviewCleanApi.Api
dotnet run
# Wait for: "Now listening on: http://localhost:5000"
```

**2. Start React Client**
```bash
cd clients/react-client
npm install  # First time only
npm run dev
# Open: http://localhost:5173
```

**3. Start Vue Client**
```bash
cd clients/vue-client
npm install  # First time only
npm run dev
# Open: http://localhost:5174
```

**Test Credentials:** `john@test.com` / `123456`

## ⚠️ Important Notes

- **Always start API before frontend clients** (prevents 403 errors)
- React client uses Vite proxy - requests go through `localhost:5173/api/*`
- Vue client uses Vite proxy - requests go through `localhost:5174/api/*`
- No CORS issues in development (proxy handles everything)

## 🏗️ Architecture

```
InterviewCleanApi.Api/          # Presentation Layer (Controllers, Middleware)
InterviewCleanApi.Application/  # Application Layer (Services, DTOs)
InterviewCleanApi.Domain/       # Domain Layer (Entities, Errors)
InterviewCleanApi.Infrastructure/ # Infrastructure Layer (Repositories, EF Core)
clients/
  ├── react-client/             # React 19 + TypeScript + TanStack Query
  ├── vue-client/               # Vue 3 + TypeScript + TanStack Query
  └── angular-client/           # Angular (not modified)
```

## 📝 API Endpoints

**Base URL:** `http://localhost:5000`

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Products (Requires Authentication)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

## 🛠️ Tech Stack

**Backend:**
- .NET 10 with Clean Architecture
- Entity Framework Core + SQLite
- JWT Bearer Authentication
- Result Pattern for error handling

**Frontend:**
- React 19 / Vue 3 with TypeScript
- TanStack Query (data fetching & caching)
- Vite (dev server with proxy)
- Professional UI themes (Ocean Blue / Emerald Green)

## 🔧 Troubleshooting

### React Client Shows Only Background
**Fix:** Restart dev server after API is running
```bash
rm -rf node_modules/.vite
npm run dev
```

### 403 Forbidden Errors
**Cause:** API not running  
**Fix:** Start API first, then restart frontend
```bash
# Terminal 1
cd InterviewCleanApi.Api && dotnet run

# Terminal 2
cd clients/react-client && npm run dev
```

### CORS Errors
**Should not happen** - Vite proxy eliminates CORS  
**If it happens:** Check `vite.config.ts` has proxy configuration

### Login Fails
**Check:**
1. API is running on port 5000
2. Test user exists in database
3. JWT configuration in `appsettings.json`

## 📖 Documentation

- **[PROJECT_SETUP.md](PROJECT_SETUP.md)** - Complete setup, architecture, and troubleshooting
- **[DOCS_INDEX.md](DOCS_INDEX.md)** - Full documentation index

## 🚀 Push to GitHub

**SSH Key Setup:**
```bash
# Your SSH public key (add to GitHub):
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEdY4H+WQtQk3R5wERzBHR4hdALL6GXJcfzszhU0os1s castrosanabriajohn@gmail.com

# Add to: https://github.com/settings/ssh/new
# Then push:
git push origin main --force-with-lease
```

See **[READY_TO_PUSH.md](READY_TO_PUSH.md)** for detailed instructions.

## ✅ Status

All systems operational and fully functional.
