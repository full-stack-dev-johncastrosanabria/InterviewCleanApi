# 🚀 Interview Clean API

A portfolio RESTful API built with **Clean Architecture** principles, featuring .NET 10, MySQL database, JWT authentication, and multiple frontend clients (React, Vue, and Angular).

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Database](#-database)
- [Authentication](#-authentication)
- [Frontend Clients](#-frontend-clients)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Contributing](#-contributing)

---

## ✨ Features

- ✅ **Clean Architecture** - Separation of concerns with clear layer boundaries
- ✅ **RESTful API** - Standard HTTP methods and status codes
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Authorization** - Admin and User roles
- ✅ **MySQL Database** - Reliable relational database with Entity Framework Core
- ✅ **Multiple Frontend Clients** - React, Vue, and Angular implementations
- ✅ **Comprehensive Testing** - Unit tests, integration tests, E2E tests, and API tests
- ✅ **Global Exception Handling** - Centralized error management
- ✅ **CORS Support** - Configured for frontend clients
- ✅ **OpenAPI/Swagger** - API documentation (Development mode)
- ✅ **Result Pattern** - Functional error handling
- ✅ **Repository Pattern** - Data access abstraction
- ✅ **Dependency Injection** - Loose coupling and testability

---

## 🛠️ Tech Stack

### Backend
- **.NET 10** - Latest .NET framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM for database access
- **MySQL** - Relational database (port 3306)
- **JWT Bearer** - Authentication tokens
- **FluentValidation** - Input validation
- **BCrypt** - Password hashing

### Frontend Clients
- **React 19** - Modern React with TypeScript
- **Vue 3** - Composition API with TypeScript
- **Angular 19** - Latest Angular with TypeScript
- **TanStack Query** - Server state management (React & Vue)
- **Vite** - Fast build tool and dev server

### Testing
- **xUnit** - Unit and integration testing framework
- **FluentAssertions** - Readable test assertions
- **Selenium WebDriver** - E2E browser automation
- **Postman/Newman** - API testing and automation
- **Playwright** - Modern E2E testing (Vue client)

---

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│              (InterviewCleanApi.Api)                 │
│         Controllers, Middleware, Program.cs          │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                 Application Layer                    │
│          (InterviewCleanApi.Application)             │
│      Services, DTOs, Abstractions, Validation        │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                   Domain Layer                       │
│             (InterviewCleanApi.Domain)               │
│         Entities, Value Objects, Interfaces          │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│               Infrastructure Layer                   │
│         (InterviewCleanApi.Infrastructure)           │
│    EF Core, Repositories, Security, Database         │
└─────────────────────────────────────────────────────┘
```

### Layer Responsibilities

**🎯 Domain Layer** (Core Business Logic)
- Entities: `User`, `Product`
- Value Objects: `Result<T>`, `Error`
- No external dependencies

**� Application Layer** (Use Cases)
- Services: `IAuthService`, `IProductService`
- DTOs: Request/Response models
- Business logic orchestration

**🔧 Infrastructure Layer** (External Concerns)
- Database context and migrations
- Repository implementations
- JWT token generation
- Password hashing

**🌐 Presentation Layer** (API)
- REST Controllers
- Global exception handling
- CORS configuration
- Authentication/Authorization middleware

---

## 📦 Prerequisites

Before running this project, ensure you have:

- **.NET 10 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/10.0)
- **MySQL Server** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Node.js 18+** - [Download](https://nodejs.org/) (for frontend clients)
- **Git** - [Download](https://git-scm.com/)

### Optional Tools
- **Visual Studio 2022** or **VS Code** - IDE
- **Postman** - API testing
- **MySQL Workbench** - Database management

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd InterviewCleanApi
```

### 2. Configure Database

Update the connection string in `InterviewCleanApi.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=InterviewCleanApiDb;user=root;password=YOUR_PASSWORD;"
  }
}
```

### 3. Run Database Migrations

```bash
cd InterviewCleanApi.Api
dotnet ef database update
```

This will create the database and seed initial data including:
- Admin user: `john@test.com` / `123456`
- Sample products

### 4. Start the API

```bash
dotnet run --launch-profile https
```

The API will be available at:
- **HTTPS:** https://localhost:7025
- **HTTP:** http://localhost:5000 (if not occupied by AirPlay)

### 5. Start a Frontend Client

#### React Client
```bash
cd clients/react-client
npm install
npm run dev
```
Access at: http://localhost:5173

#### Vue Client
```bash
cd clients/vue-client
npm install
npm run dev
```
Access at: http://localhost:5174

#### Angular Client
```bash
cd clients/angular-client
npm install
npm start
```
Access at: http://localhost:4200

### 6. Test Credentials

Use these credentials to log in:
- **Email:** `john@test.com`
- **Password:** `123456`
- **Role:** Admin (can create/update/delete products)

---

## 📝 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### Product Endpoints

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/products` | Get all products | Yes | No |
| GET | `/api/products/{id}` | Get product by ID | Yes | No |
| POST | `/api/products` | Create new product | Yes | Yes |
| PUT | `/api/products/{id}` | Update product | Yes | Yes |
| DELETE | `/api/products/{id}` | Delete product | Yes | Yes |

### Request/Response Examples

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response: `204 No Content`

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAtUtc": "2026-04-24T12:00:00Z"
}
```

#### Get All Products
```http
GET /api/products
Authorization: Bearer {token}
```

Response:
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 50,
    "createdAtUtc": "2026-04-23T10:00:00Z"
  }
]
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 29.99,
  "stock": 100
}
```

Response: `201 Created` with product details

---

## 🗄️ Database

### Database: MySQL

The application uses **MySQL** (not SQLite) as the relational database.

**Connection Details:**
- **Server:** localhost
- **Port:** 3306
- **Database:** InterviewCleanApiDb
- **User:** root (configurable)

### Database Schema

#### Users Table
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserName VARCHAR(50) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL,
    CreatedAtUtc DATETIME NOT NULL
);
```

#### Products Table
```sql
CREATE TABLE Products (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(200) NOT NULL,
    Description VARCHAR(1000),
    Price DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL,
    CreatedAtUtc DATETIME NOT NULL
);
```

### Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName --project InterviewCleanApi.Infrastructure --startup-project InterviewCleanApi.Api

# Apply migrations
dotnet ef database update --project InterviewCleanApi.Api

# Remove last migration
dotnet ef migrations remove --project InterviewCleanApi.Infrastructure --startup-project InterviewCleanApi.Api
```

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### How It Works

1. **Register/Login** - User provides credentials
2. **Token Generation** - Server generates JWT token with claims
3. **Token Storage** - Client stores token (localStorage/sessionStorage)
4. **Authenticated Requests** - Client sends token in Authorization header
5. **Token Validation** - Server validates token on each request

### JWT Configuration

Located in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_HERE",
    "Issuer": "InterviewCleanApi",
    "Audience": "InterviewCleanApiUsers",
    "ExpirationMinutes": 60
  }
}
```

### Token Claims

- `sub` - User ID
- `email` - User email
- `name` - Username
- `role` - User role (Admin/User)
- `jti` - Unique token ID
- `exp` - Expiration timestamp

### Authorization

Use the `[Authorize]` attribute for protected endpoints:

```csharp
[Authorize] // Requires authentication
public class ProductsController : ControllerBase { }

[Authorize(Roles = "Admin")] // Requires Admin role
[HttpPost]
public async Task<IActionResult> Create() { }
```

---

## � Frontend Clients

The project includes three frontend implementations:

### React Client (React 19 + TypeScript)
- **Location:** `clients/react-client/`
- **Port:** 5173
- **Features:** TanStack Query, Vite, Modern React patterns
- **Documentation:** See `clients/react-client/README.md`

### Vue Client (Vue 3 + TypeScript)
- **Location:** `clients/vue-client/`
- **Port:** 5174
- **Features:** Composition API, TanStack Query, Playwright E2E tests
- **Documentation:** See `clients/vue-client/INSTALACION.md`

### Angular Client (Angular 19 + TypeScript)
- **Location:** `clients/angular-client/`
- **Port:** 4200
- **Features:** Standalone components, RxJS, Angular Material
- **Documentation:** See `clients/angular-client/README.md`

All clients share:
- JWT authentication
- Product CRUD operations
- Responsive design
- Form validation
- Error handling

---

## 🧪 Testing

Comprehensive testing suite covering all layers. See [BACKEND_TESTING.md](./BACKEND_TESTING.md) for detailed documentation.

### Test Types

1. **Unit Tests** - Test individual components in isolation
2. **Integration Tests** - Test API endpoints with in-memory database
3. **E2E Tests** - Test complete user flows with Selenium
4. **API Tests** - Test API with Postman/Newman

### Run Tests

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test class
dotnet test --filter "FullyQualifiedName~ProductsControllerTests"

# Run E2E tests (requires frontend running)
dotnet test --filter "FullyQualifiedName~E2ETests"
```

### Test Coverage

- **Controllers:** 100%
- **Services:** 100%
- **Repositories:** 100%
- **E2E Flows:** React & Vue clients
- **API Endpoints:** 100% (Postman collection)

---

## 📁 Project Structure

```
InterviewCleanApi/
├── InterviewCleanApi.Api/              # Presentation Layer
│   ├── Controllers/                    # API Controllers
│   │   ├── AuthController.cs
│   │   └── ProductsController.cs
│   ├── Middleware/                     # Custom middleware
│   │   └── GlobalExceptionHandler.cs
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── Program.cs                      # Application entry point
│   ├── appsettings.json               # Configuration
│   └── InterviewCleanApi.Api.csproj
│
├── InterviewCleanApi.Application/      # Application Layer
│   ├── Abstractions/                   # Service interfaces
│   │   ├── IAuthService.cs
│   │   └── IProductService.cs
│   ├── DTOs/                          # Data Transfer Objects
│   │   ├── Auth/
│   │   │   ├── LoginRequest.cs
│   │   │   ├── LoginResponse.cs
│   │   │   └── RegisterRequest.cs
│   │   └── Products/
│   │       ├── ProductRequest.cs
│   │       └── ProductResponse.cs
│   └── InterviewCleanApi.Application.csproj
│
├── InterviewCleanApi.Domain/           # Domain Layer
│   ├── Common/                        # Shared domain concepts
│   │   ├── Error.cs
│   │   └── Result.cs
│   ├── Entities/                      # Domain entities
│   │   ├── Product.cs
│   │   └── User.cs
│   ├── Repositories/                  # Repository interfaces
│   │   ├── IProductRepository.cs
│   │   └── IUserRepository.cs
│   └── InterviewCleanApi.Domain.csproj
│
├── InterviewCleanApi.Infrastructure/   # Infrastructure Layer
│   ├── Data/                          # Database context
│   │   └── ApplicationDbContext.cs
│   ├── Repositories/                  # Repository implementations
│   │   ├── ProductRepository.cs
│   │   └── UserRepository.cs
│   ├── Security/                      # Security implementations
│   │   ├── JwtOptions.cs
│   │   ├── JwtProvider.cs
│   │   └── PasswordHasher.cs
│   ├── Services/                      # Service implementations
│   │   ├── AuthService.cs
│   │   └── ProductService.cs
│   ├── DependencyInjection.cs        # DI configuration
│   └── InterviewCleanApi.Infrastructure.csproj
│
├── InterviewCleanApi.Tests/            # Test Project
│   ├── E2ETests.cs                    # Selenium E2E tests
│   ├── ProductsControllerTests.cs     # Integration tests
│   └── InterviewCleanApi.Tests.csproj
│
├── clients/                            # Frontend Clients
│   ├── react-client/                  # React implementation
│   ├── vue-client/                    # Vue implementation
│   └── angular-client/                # Angular implementation
│
├── .postman.json                       # Postman configuration
├── InterviewCleanApi.postman_collection.json
├── InterviewCleanApi.postman_environment.json
├── CleanArchitectureAPI.sln           # Solution file
├── README.md                          # This file
└── BACKEND_TESTING.md                 # Testing documentation
```

---

## ⚙️ Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=InterviewCleanApiDb;user=root;password=YOUR_PASSWORD;"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_MINIMUM_32_CHARACTERS",
    "Issuer": "InterviewCleanApi",
    "Audience": "InterviewCleanApiUsers",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### CORS Configuration

Configured in `Program.cs` to allow frontend clients:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:4200",  // Angular
                "http://localhost:5173",  // React
                "http://localhost:5174"   // Vue
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style

- Follow C# coding conventions
- Use meaningful variable and method names
- Add XML documentation comments for public APIs
- Write unit tests for new features
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review test examples

---

## 🎯 Roadmap

- [ ] Add refresh token functionality
- [ ] Implement email verification
- [ ] Add password reset feature
- [ ] Implement rate limiting
- [ ] Add caching layer (Redis)
- [ ] Add logging (Serilog)
- [ ] Add health checks
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] API versioning

---

**Built with ❤️ using Clean Architecture principles**
