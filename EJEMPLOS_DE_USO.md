# 📖 Ejemplos de Uso - Nuevas Características

## 🎯 Patrón Result

### Ejemplo 1: Uso Básico en Servicios

```csharp
// ✅ Operación exitosa
public async Task<Result<ProductResponse>> GetByIdAsync(int id)
{
    var product = await _repository.GetByIdAsync(id);
    
    if (product is null)
        return Result.Failure<ProductResponse>(DomainErrors.Product.NotFound(id));
    
    return Result.Success(MapToResponse(product));
}

// ✅ Operación sin valor de retorno
public async Task<Result> DeleteAsync(int id)
{
    var product = await _repository.GetByIdAsync(id);
    
    if (product is null)
        return Result.Failure(DomainErrors.Product.NotFound(id));
    
    _repository.Delete(product);
    await _unitOfWork.SaveChangesAsync();
    
    return Result.Success();
}
```

### Ejemplo 2: Manejo en Controladores

```csharp
[HttpGet("{id:int}")]
public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
{
    var result = await _productService.GetByIdAsync(id, cancellationToken);
    
    // Verificar si la operación falló
    if (result.IsFailure)
    {
        // Manejar diferentes tipos de errores
        return result.Error.Code switch
        {
            "Error.NotFound" => NotFound(new { error = result.Error.Message }),
            "Error.Validation" => BadRequest(new { error = result.Error.Message }),
            "Error.Unauthorized" => Unauthorized(new { error = result.Error.Message }),
            _ => Problem(
                statusCode: StatusCodes.Status500InternalServerError,
                title: result.Error.Code,
                detail: result.Error.Message)
        };
    }
    
    // Acceder al valor solo si fue exitoso
    return Ok(result.Value);
}
```

### Ejemplo 3: Composición con Result Extensions

```csharp
// Map: Transformar el valor de un Result exitoso
var productResult = await _productService.GetByIdAsync(id);
var dtoResult = productResult.Map(product => new ProductDto
{
    Id = product.Id,
    DisplayName = $"{product.Name} - ${product.Price}"
});

// Bind: Encadenar operaciones que retornan Result
var result = await _productService.GetByIdAsync(id)
    .Bind(async product => await _inventoryService.CheckStockAsync(product.Id))
    .Bind(async stock => await _orderService.CreateOrderAsync(stock));

// Match: Ejecutar diferentes acciones según el resultado
var message = result.Match(
    onSuccess: value => $"Operación exitosa: {value}",
    onFailure: error => $"Error: {error.Message}"
);
```

---

## 🗄️ Repository Genérico

### Ejemplo 1: Crear un Nuevo Repositorio

```csharp
// 1. Definir la interfaz específica
public interface IOrderRepository : IRepository<Order>
{
    Task<IReadOnlyList<Order>> GetByUserIdAsync(int userId, CancellationToken ct = default);
    Task<Order?> GetWithDetailsAsync(int id, CancellationToken ct = default);
}

// 2. Implementar heredando de Repository<T>
public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext dbContext) : base(dbContext)
    {
    }
    
    // Métodos CRUD básicos ya están implementados por Repository<T>
    // Solo implementar métodos específicos
    
    public async Task<IReadOnlyList<Order>> GetByUserIdAsync(
        int userId, 
        CancellationToken ct = default)
    {
        return await DbSet
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAtUtc)
            .ToListAsync(ct);
    }
    
    public async Task<Order?> GetWithDetailsAsync(
        int id, 
        CancellationToken ct = default)
    {
        return await DbSet
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id, ct);
    }
}
```

### Ejemplo 2: Uso en Servicios

```csharp
public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    
    public OrderService(IOrderRepository orderRepository, IUnitOfWork unitOfWork)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<Result<OrderResponse>> CreateAsync(OrderRequest request)
    {
        var order = new Order
        {
            UserId = request.UserId,
            TotalAmount = request.TotalAmount
        };
        
        // Método del repositorio genérico
        await _orderRepository.AddAsync(order);
        
        // Guardar con Unit of Work
        await _unitOfWork.SaveChangesAsync();
        
        return Result.Success(MapToResponse(order));
    }
    
    public async Task<Result<IReadOnlyList<OrderResponse>>> GetUserOrdersAsync(int userId)
    {
        // Método específico del repositorio
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        
        var response = orders.Select(MapToResponse).ToList();
        return Result.Success<IReadOnlyList<OrderResponse>>(response);
    }
}
```

---

## 🔄 Unit of Work

### Ejemplo 1: Transacciones Simples

```csharp
public async Task<Result> TransferStockAsync(int fromProductId, int toProductId, int quantity)
{
    var fromProduct = await _productRepository.GetByIdAsync(fromProductId);
    var toProduct = await _productRepository.GetByIdAsync(toProductId);
    
    if (fromProduct is null || toProduct is null)
        return Result.Failure(new Error("Product.NotFound", "Producto no encontrado"));
    
    if (fromProduct.Stock < quantity)
        return Result.Failure(new Error("Product.InsufficientStock", "Stock insuficiente"));
    
    // Modificar ambos productos
    fromProduct.Stock -= quantity;
    toProduct.Stock += quantity;
    
    _productRepository.Update(fromProduct);
    _productRepository.Update(toProduct);
    
    // Una sola llamada para guardar todos los cambios
    // Si falla, se hace rollback automático
    await _unitOfWork.SaveChangesAsync();
    
    return Result.Success();
}
```

### Ejemplo 2: Transacciones Complejas

```csharp
public async Task<Result<OrderResponse>> CreateOrderWithItemsAsync(CreateOrderRequest request)
{
    try
    {
        // 1. Crear la orden
        var order = new Order
        {
            UserId = request.UserId,
            TotalAmount = 0
        };
        await _orderRepository.AddAsync(order);
        
        // 2. Crear los items y actualizar stock
        decimal totalAmount = 0;
        foreach (var item in request.Items)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product is null)
                return Result.Failure<OrderResponse>(
                    DomainErrors.Product.NotFound(item.ProductId));
            
            if (product.Stock < item.Quantity)
                return Result.Failure<OrderResponse>(
                    new Error("Product.InsufficientStock", 
                        $"Stock insuficiente para {product.Name}"));
            
            // Reducir stock
            product.Stock -= item.Quantity;
            _productRepository.Update(product);
            
            // Crear item
            var orderItem = new OrderItem
            {
                Order = order,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            };
            await _orderItemRepository.AddAsync(orderItem);
            
            totalAmount += product.Price * item.Quantity;
        }
        
        order.TotalAmount = totalAmount;
        _orderRepository.Update(order);
        
        // 3. Guardar todo en una transacción
        // Si algo falla, se hace rollback de todo
        await _unitOfWork.SaveChangesAsync();
        
        _logger.LogInformation("Order {OrderId} created successfully", order.Id);
        return Result.Success(MapToResponse(order));
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating order");
        return Result.Failure<OrderResponse>(
            new Error("Order.CreateFailed", "Error al crear la orden"));
    }
}
```

---

## ❌ Errores de Dominio

### Ejemplo 1: Definir Nuevos Errores

```csharp
// En DomainErrors.cs
public static class DomainErrors
{
    public static class Order
    {
        public static Error NotFound(int id) => 
            Error.NotFound("Orden", id);
            
        public static Error InvalidAmount => 
            Error.Validation("El monto de la orden debe ser mayor a cero");
            
        public static Error AlreadyCancelled => 
            Error.Conflict("La orden ya fue cancelada");
            
        public static Error CannotCancelShipped => 
            Error.Conflict("No se puede cancelar una orden enviada");
    }
    
    public static class Payment
    {
        public static Error InsufficientFunds => 
            Error.Validation("Fondos insuficientes");
            
        public static Error PaymentDeclined => 
            Error.Validation("Pago rechazado por el procesador");
            
        public static Error InvalidCardNumber => 
            Error.Validation("Número de tarjeta inválido");
    }
}
```

### Ejemplo 2: Usar Errores en Servicios

```csharp
public async Task<Result> CancelOrderAsync(int orderId)
{
    var order = await _orderRepository.GetByIdAsync(orderId);
    
    if (order is null)
        return Result.Failure(DomainErrors.Order.NotFound(orderId));
    
    if (order.Status == OrderStatus.Cancelled)
        return Result.Failure(DomainErrors.Order.AlreadyCancelled);
    
    if (order.Status == OrderStatus.Shipped)
        return Result.Failure(DomainErrors.Order.CannotCancelShipped);
    
    order.Status = OrderStatus.Cancelled;
    _orderRepository.Update(order);
    await _unitOfWork.SaveChangesAsync();
    
    return Result.Success();
}
```

---

## ✅ Validación con Data Annotations

### Ejemplo 1: DTOs con Validación Completa

```csharp
public sealed record CreateOrderRequest(
    [Required(ErrorMessage = "El ID de usuario es requerido")]
    [Range(1, int.MaxValue, ErrorMessage = "ID de usuario inválido")]
    int UserId,
    
    [Required(ErrorMessage = "La dirección de envío es requerida")]
    [MinLength(10, ErrorMessage = "La dirección debe tener al menos 10 caracteres")]
    [MaxLength(500, ErrorMessage = "La dirección no puede exceder 500 caracteres")]
    string ShippingAddress,
    
    [Required(ErrorMessage = "Los items son requeridos")]
    [MinLength(1, ErrorMessage = "Debe incluir al menos un item")]
    List<OrderItemRequest> Items,
    
    [EmailAddress(ErrorMessage = "Email inválido")]
    string? NotificationEmail,
    
    [Phone(ErrorMessage = "Teléfono inválido")]
    string? PhoneNumber
);

public sealed record OrderItemRequest(
    [Required]
    [Range(1, int.MaxValue)]
    int ProductId,
    
    [Required]
    [Range(1, 1000, ErrorMessage = "La cantidad debe estar entre 1 y 1000")]
    int Quantity
);
```

### Ejemplo 2: Validación Personalizada

```csharp
using System.ComponentModel.DataAnnotations;

public class FutureDateAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(
        object? value, 
        ValidationContext validationContext)
    {
        if (value is DateTime date)
        {
            if (date <= DateTime.UtcNow)
            {
                return new ValidationResult(
                    "La fecha debe ser futura");
            }
        }
        
        return ValidationResult.Success;
    }
}

// Uso
public sealed record ScheduleDeliveryRequest(
    [Required]
    int OrderId,
    
    [Required]
    [FutureDate]
    DateTime DeliveryDate
);
```

### Ejemplo 3: Validación en Controladores

```csharp
[HttpPost]
public async Task<IActionResult> Create(
    [FromBody] CreateOrderRequest request, 
    CancellationToken cancellationToken)
{
    // ModelState se valida automáticamente
    if (!ModelState.IsValid)
    {
        // Retornar errores de validación
        return BadRequest(new
        {
            errors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                )
        });
    }
    
    var result = await _orderService.CreateAsync(request, cancellationToken);
    
    if (result.IsFailure)
        return BadRequest(new { error = result.Error.Message });
    
    return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
}
```

---

## 📝 Logging Estructurado

### Ejemplo 1: Logging en Servicios

```csharp
public class OrderService : IOrderService
{
    private readonly ILogger<OrderService> _logger;
    
    public async Task<Result<OrderResponse>> CreateAsync(CreateOrderRequest request)
    {
        _logger.LogInformation(
            "Creating order for user {UserId} with {ItemCount} items",
            request.UserId,
            request.Items.Count);
        
        try
        {
            // ... lógica de creación
            
            _logger.LogInformation(
                "Order {OrderId} created successfully for user {UserId}. Total: {TotalAmount:C}",
                order.Id,
                request.UserId,
                order.TotalAmount);
            
            return Result.Success(MapToResponse(order));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error creating order for user {UserId}",
                request.UserId);
            
            return Result.Failure<OrderResponse>(
                new Error("Order.CreateFailed", "Error al crear la orden"));
        }
    }
    
    public async Task<Result> CancelAsync(int orderId)
    {
        _logger.LogWarning(
            "Cancellation requested for order {OrderId}",
            orderId);
        
        var order = await _orderRepository.GetByIdAsync(orderId);
        
        if (order is null)
        {
            _logger.LogWarning(
                "Order {OrderId} not found for cancellation",
                orderId);
            return Result.Failure(DomainErrors.Order.NotFound(orderId));
        }
        
        // ... lógica de cancelación
        
        _logger.LogInformation(
            "Order {OrderId} cancelled successfully",
            orderId);
        
        return Result.Success();
    }
}
```

### Ejemplo 2: Niveles de Logging

```csharp
// Trace: Información muy detallada para debugging
_logger.LogTrace("Entering method GetByIdAsync with id {Id}", id);

// Debug: Información útil durante desarrollo
_logger.LogDebug("Query executed: {Query}", query);

// Information: Flujo normal de la aplicación
_logger.LogInformation("User {UserId} logged in successfully", userId);

// Warning: Situaciones anormales pero recuperables
_logger.LogWarning("Product {ProductId} has low stock: {Stock}", productId, stock);

// Error: Errores que impiden completar una operación
_logger.LogError(ex, "Failed to process payment for order {OrderId}", orderId);

// Critical: Errores graves que requieren atención inmediata
_logger.LogCritical("Database connection lost");
```

---

## 🛡️ Global Exception Handler

### Ejemplo 1: Manejo Personalizado de Excepciones

```csharp
public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, 
            "Unhandled exception occurred: {Message}", 
            exception.Message);
        
        var problemDetails = exception switch
        {
            UnauthorizedAccessException => new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Unauthorized",
                Detail = exception.Message
            },
            InvalidOperationException => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Bad Request",
                Detail = exception.Message
            },
            KeyNotFoundException => new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Not Found",
                Detail = exception.Message
            },
            DbUpdateException => new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Database Error",
                Detail = "Error al actualizar la base de datos"
            },
            _ => new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Internal Server Error",
                Detail = "Ha ocurrido un error interno"
            }
        };
        
        httpContext.Response.StatusCode = problemDetails.Status.Value;
        httpContext.Response.ContentType = "application/json";
        
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        
        return true;
    }
}
```

---

## 🧪 Testing con las Nuevas Características

### Ejemplo 1: Unit Test de Servicios con Result

```csharp
public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<ProductService>> _loggerMock;
    private readonly ProductService _sut;
    
    public ProductServiceTests()
    {
        _repositoryMock = new Mock<IProductRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<ProductService>>();
        _sut = new ProductService(
            _repositoryMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }
    
    [Fact]
    public async Task GetByIdAsync_WhenProductExists_ReturnsSuccess()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Test", Price = 10, Stock = 5 };
        _repositoryMock
            .Setup(x => x.GetByIdAsync(1, default))
            .ReturnsAsync(product);
        
        // Act
        var result = await _sut.GetByIdAsync(1);
        
        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal(1, result.Value.Id);
        Assert.Equal("Test", result.Value.Name);
    }
    
    [Fact]
    public async Task GetByIdAsync_WhenProductNotFound_ReturnsFailure()
    {
        // Arrange
        _repositoryMock
            .Setup(x => x.GetByIdAsync(999, default))
            .ReturnsAsync((Product?)null);
        
        // Act
        var result = await _sut.GetByIdAsync(999);
        
        // Assert
        Assert.True(result.IsFailure);
        Assert.Equal("Error.NotFound", result.Error.Code);
    }
    
    [Fact]
    public async Task CreateAsync_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var request = new ProductRequest("Test Product", "Description", 10.99m, 5);
        _unitOfWorkMock
            .Setup(x => x.SaveChangesAsync(default))
            .ReturnsAsync(1);
        
        // Act
        var result = await _sut.CreateAsync(request);
        
        // Assert
        Assert.True(result.IsSuccess);
        _repositoryMock.Verify(x => x.AddAsync(It.IsAny<Product>(), default), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }
}
```

### Ejemplo 2: Integration Test con Result

```csharp
public class ProductsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    
    public ProductsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task GetById_WhenProductExists_ReturnsOk()
    {
        // Arrange
        var productId = 1;
        
        // Act
        var response = await _client.GetAsync($"/api/products/{productId}");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var product = await response.Content.ReadFromJsonAsync<ProductResponse>();
        Assert.NotNull(product);
        Assert.Equal(productId, product.Id);
    }
    
    [Fact]
    public async Task GetById_WhenProductNotFound_ReturnsNotFound()
    {
        // Arrange
        var productId = 999;
        
        // Act
        var response = await _client.GetAsync($"/api/products/{productId}");
        
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
```

---

## 🎓 Mejores Prácticas

### ✅ DO's

```csharp
// ✅ Usar Result para operaciones que pueden fallar
public async Task<Result<Product>> GetProductAsync(int id)

// ✅ Usar Unit of Work para transacciones
await _unitOfWork.SaveChangesAsync();

// ✅ Usar errores de dominio centralizados
return Result.Failure(DomainErrors.Product.NotFound(id));

// ✅ Validar con Data Annotations
public record ProductRequest([Required] string Name);

// ✅ Logging estructurado con parámetros
_logger.LogInformation("Product {ProductId} created", product.Id);

// ✅ Usar CancellationToken
public async Task<Result> DeleteAsync(int id, CancellationToken ct = default)
```

### ❌ DON'Ts

```csharp
// ❌ No usar excepciones para flujo de control
if (product == null)
    throw new NotFoundException("Product not found");

// ❌ No llamar SaveChanges en repositorios
await _repository.SaveChangesAsync(); // Usar UnitOfWork

// ❌ No usar strings para errores
return Result.Failure(new Error("Error", "Something went wrong"));

// ❌ No validar manualmente en servicios
if (string.IsNullOrEmpty(request.Name))
    throw new ValidationException("Name required");

// ❌ No usar concatenación de strings en logs
_logger.LogInformation("Product " + productId + " created");

// ❌ No ignorar CancellationToken
public async Task<Result> DeleteAsync(int id) // Falta CancellationToken
```

---

## 📞 Soporte

Para más información sobre las mejoras implementadas, consulta:
- `README_IMPROVEMENTS.md` - Documentación detallada
- `MEJORAS_IMPLEMENTADAS.md` - Resumen ejecutivo
- Código fuente con XML comments

**¡Feliz codificación! 🚀**
