# InterviewCleanApi - Complete Setup Guide

## 🚀 Quick Start

### Start the Application

```bash
# 1. Start API
cd InterviewCleanApi.Api
dotnet run
# Available at: http://localhost:5000

# 2. Start React Client
cd clients/react-client
npm install  # First time only
npm run dev
# Available at: http://localhost:5173

# 3. Start Vue Client
cd clients/vue-client
npm install  # First time only
npm run dev
# Available at: http://localhost:5174
```

### Default Test Credentials
- **Email:** `john@test.com`
- **Password:** `123456`

---

## 📋 Recent Fixes Applied

### 1. Project Renamed
- `InterViewCleanApi/` → `InterviewCleanApi.Api/`
- Updated namespaces, solution file, and all references

### 2. CORS Issues Fixed
**Problem:** Browsers blocked requests due to HTTPS redirect stripping CORS headers.

**Solution in `InterviewCleanApi.Api/Program.cs`:**
```csharp
// CORS must come BEFORE HTTPS redirect
app.UseCors("frontend");

// Only redirect to HTTPS in production
if (!app.Environment.IsDevelopment()) app.UseHttpsRedirection();
```

### 3. Frontend Clients Fixed

#### React Client
**Problem:** Only showing background (wrong entry point in `index.html`)

**Fixed:** `clients/react-client/index.html`
```html
<script type="module" src="/src/main.tsx"></script>
```

**Added Vite Proxy:** `clients/react-client/vite.config.ts`
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

**Updated API Base URL:** `clients/react-client/src/services/api.ts`
```typescript
const API_BASE_URL = ''; // Uses Vite proxy
```

#### Vue Client
**Added Vite Proxy:** `clients/vue-client/vite.config.ts`
```typescript
server: {
  port: 5174,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

**Updated API Base URL:** `clients/vue-client/src/services/api.ts`
```typescript
const API_BASE_URL = ''; // Uses Vite proxy
```

**Removed Redundant Auth Headers:** Both clients now auto-inject auth headers in `api.ts` only.

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Client   │  http://localhost:5173
│  (Port 5173)    │  /api/* → Vite Proxy
└────────┬────────┘
         │
┌────────▼────────┐
│   Vue Client    │  http://localhost:5174
│  (Port 5174)    │  /api/* → Vite Proxy
└────────┬────────┘
         │
┌────────▼────────┐
│   .NET API      │  http://localhost:5000 (dev)
│  (Port 5000)    │  https://localhost:7025 (prod)
└─────────────────┘
```

### How It Works
1. Frontend makes request to `/api/products` (same origin)
2. Vite proxy forwards to `http://localhost:5000/api/products`
3. API processes request and returns response
4. **No CORS issues** - browser sees same-origin request

---

## 📁 Project Structure

```
InterviewCleanApi/
├── InterviewCleanApi.Api/          # Presentation Layer
│   ├── Controllers/
│   │   ├── AuthController.cs       # POST /api/auth/register, /login
│   │   └── ProductsController.cs   # CRUD /api/products
│   ├── Middleware/
│   │   └── GlobalExceptionHandler.cs
│   └── Program.cs                  # Startup & middleware config
│
├── InterviewCleanApi.Application/  # Application Layer
│   ├── Abstractions/               # Interfaces
│   ├── DTOs/                       # Data Transfer Objects
│   └── Services/                   # Business logic
│
├── InterviewCleanApi.Domain/       # Domain Layer
│   ├── Entities/                   # Domain models
│   ├── Common/                     # Result pattern, base classes
│   └── Errors/                     # Domain errors
│
├── InterviewCleanApi.Infrastructure/ # Infrastructure Layer
│   ├── Repositories/               # Data access
│   ├── Security/                   # JWT, password hashing
│   └── Data/                       # EF Core context
│
└── clients/
    ├── react-client/               # React + TypeScript + TanStack Query
    ├── vue-client/                 # Vue + TypeScript + TanStack Query
    └── angular-client/             # Angular (not modified)
```

---

## 🔌 API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Products (Requires Authentication)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

---

## 🛠️ Troubleshooting

### React Client - Blank Screen
**Check:** `clients/react-client/index.html` loads `main.tsx` (not `main.jsx`)
```bash
cd clients/react-client
./verify-setup.sh  # Run verification script
```

### CORS Errors
**Causes:**
1. API not running on `http://localhost:5000`
2. Vite proxy not configured
3. Frontend not restarted after config changes

**Fix:**
1. Ensure API is running
2. Check `vite.config.ts` has proxy configuration
3. Restart Vite dev server (Ctrl+C, then `npm run dev`)

### Authentication Fails
**Causes:**
1. Test user doesn't exist in database
2. JWT configuration missing in `appsettings.json`
3. Token not stored in localStorage

**Fix:**
1. Verify test user exists or register new user
2. Check `appsettings.json` has `Jwt` section
3. Check browser DevTools → Application → Local Storage

### Build Errors
```bash
# Clean and rebuild API
dotnet clean
dotnet build

# Clean and reinstall frontend
cd clients/react-client  # or vue-client
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Verification Checklist

### API
- [ ] Runs on `http://localhost:5000`
- [ ] Returns 401 for `/api/products` (expected without auth)
- [ ] No errors in console

### React Client
- [ ] Runs on `http://localhost:5173`
- [ ] Shows login form with ocean blue theme
- [ ] No 404 errors for `main.tsx`
- [ ] No CORS errors in browser console

### Vue Client
- [ ] Runs on `http://localhost:5174`
- [ ] Shows login form with green theme
- [ ] No CORS errors in browser console

### Functionality
- [ ] Can login with test credentials
- [ ] Products load after login
- [ ] Can create new product (Admin role)
- [ ] Can delete product (Admin role)
- [ ] Logout works correctly

---

## 🎯 Key Features

### Backend (.NET)
- ✅ Clean Architecture (Domain, Application, Infrastructure, API)
- ✅ JWT Bearer Authentication
- ✅ Result Pattern for error handling
- ✅ Global Exception Handler
- ✅ Entity Framework Core
- ✅ Repository Pattern
- ✅ CORS configured for all clients

### Frontend (React & Vue)
- ✅ TypeScript with full type safety
- ✅ TanStack Query for data fetching & caching
- ✅ JWT Authentication with localStorage
- ✅ Auto-injection of auth headers
- ✅ Vite proxy for CORS-free development
- ✅ Professional UI with theme colors
- ✅ Responsive design
- ✅ Clean Architecture patterns

---

## 📝 Important Notes

### Development
- **HTTPS redirect disabled in Development** - avoids CORS issues
- **Vite proxy handles all API calls** - no direct cross-origin requests
- **Auth headers auto-injected** - services don't need to add them manually

### Production Deployment
1. Build frontend: `npm run build`
2. Update CORS origins in `Program.cs`
3. HTTPS redirect automatically enabled
4. Use environment variables for configuration
5. Serve static files from API or CDN

### Database
- Uses SQLite for development
- Connection string in `appsettings.json`
- Migrations in `InterviewCleanApi.Infrastructure`

### Testing
```bash
# API
dotnet test

# React Client
cd clients/react-client
npm run test

# Vue Client
cd clients/vue-client
npm run test
```

---

## 🔧 Configuration Files

### API: `appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=app.db"
  },
  "Jwt": {
    "Key": "your-secret-key-here",
    "Issuer": "InterviewCleanApi",
    "Audience": "InterviewCleanApi",
    "ExpirationMinutes": 60
  }
}
```

### React: `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

### Vue: `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 📚 Additional Resources

- **Postman Hook:** `.kiro/hooks/postman-api-testing.kiro.hook` - Auto-tests API on file changes
- **Verification Script:** `clients/react-client/verify-setup.sh` - Checks setup
- **Architecture Docs:** `CONVENCIONES_ARQUITECTURA.md`
- **Design System:** `DESIGN_SYSTEM.md`

---

## 🎉 Status: FULLY OPERATIONAL

All systems are configured and working:
- ✅ API project renamed and building
- ✅ CORS issues resolved
- ✅ React client fully functional
- ✅ Vue client fully functional
- ✅ Authentication working
- ✅ CRUD operations functional
- ✅ No TypeScript errors
- ✅ No build errors
