using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Products;
using InterviewCleanApi.Domain.Entities;

namespace InterviewCleanApi.Infrastructure.Services;

/// <summary>
///     Implements product CRUD use cases on top of the repository layer.
/// </summary>
public sealed class ProductService(IProductRepository productRepository) : IProductService
{
    /// <summary>
    ///     Returns all products mapped into API response DTOs.
    /// </summary>
    public async Task<IReadOnlyCollection<ProductResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var products = await productRepository.GetAllAsync(cancellationToken);

        return products
            .Select(MapToResponse)
            .ToList();
    }

    /// <summary>
    ///     Returns a single product DTO when the entity exists.
    /// </summary>
    public async Task<ProductResponse?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);

        return product is null ? null : MapToResponse(product);
    }

    /// <summary>
    ///     Validates the request, creates a new product, and saves it.
    /// </summary>
    public async Task<ProductResponse> CreateAsync(ProductRequest request, CancellationToken cancellationToken)
    {
        ValidateRequest(request);

        var product = new Product
        {
            Name = request.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description)
                ? null
                : request.Description.Trim(),
            Price = request.Price,
            Stock = request.Stock
        };

        await productRepository.AddAsync(product, cancellationToken);
        await productRepository.SaveChangesAsync(cancellationToken);

        return MapToResponse(product);
    }

    /// <summary>
    ///     Updates an existing product when found.
    /// </summary>
    public async Task<bool> UpdateAsync(int id, ProductRequest request, CancellationToken cancellationToken)
    {
        ValidateRequest(request);

        var product = await productRepository.GetByIdAsync(id, cancellationToken);

        if (product is null)
            return false;

        product.Name = request.Name.Trim();
        product.Description = string.IsNullOrWhiteSpace(request.Description)
            ? null
            : request.Description.Trim();
        product.Price = request.Price;
        product.Stock = request.Stock;

        productRepository.Update(product);
        await productRepository.SaveChangesAsync(cancellationToken);

        return true;
    }

    /// <summary>
    ///     Deletes a product when it exists.
    /// </summary>
    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);

        if (product is null)
            return false;

        productRepository.Delete(product);
        await productRepository.SaveChangesAsync(cancellationToken);

        return true;
    }

    /// <summary>
    ///     Centralizes entity-to-DTO mapping so every endpoint returns the same structure.
    /// </summary>
    private static ProductResponse MapToResponse(Product product)
    {
        return new ProductResponse(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Stock,
            product.CreatedAtUtc
        );
    }

    /// <summary>
    ///     Enforces the business rules expected by the product CRUD endpoints.
    /// </summary>
    private static void ValidateRequest(ProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new InvalidOperationException("El nombre del producto es requerido.");

        if (request.Price < 0)
            throw new InvalidOperationException("El precio no puede ser negativo.");

        if (request.Stock < 0)
            throw new InvalidOperationException("El stock no puede ser negativo.");
    }
}