using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Products;
using InterviewCleanApi.Domain.Common;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Domain.Errors;
using Microsoft.Extensions.Logging;

namespace InterviewCleanApi.Infrastructure.Services;

/// <summary>
///     Implements product business logic using the Result pattern.
/// </summary>
public sealed class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        IProductRepository productRepository,
        IUnitOfWork unitOfWork,
        ILogger<ProductService> logger)
    {
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<IReadOnlyList<ProductResponse>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var products = await _productRepository.GetAllAsync(cancellationToken);
            var response = products.Select(MapToResponse).ToList();

            _logger.LogInformation("Retrieved {Count} products", response.Count);
            return Result.Success<IReadOnlyList<ProductResponse>>(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return Result.Failure<IReadOnlyList<ProductResponse>>(
                new Error("Product.GetAllFailed", "Error al obtener los productos"));
        }
    }

    public async Task<Result<ProductResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var product = await _productRepository.GetByIdAsync(id, cancellationToken);

            if (product is null)
            {
                _logger.LogWarning("Product with id {ProductId} not found", id);
                return Result.Failure<ProductResponse>(DomainErrors.Product.NotFound(id));
            }

            return Result.Success(MapToResponse(product));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product {ProductId}", id);
            return Result.Failure<ProductResponse>(
                new Error("Product.GetByIdFailed", "Error al obtener el producto"));
        }
    }

    public async Task<Result<ProductResponse>> CreateAsync(ProductRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var validationResult = ValidateProductRequest(request);
            if (validationResult.IsFailure)
            {
                return Result.Failure<ProductResponse>(validationResult.Error);
            }

            var product = new Product
            {
                Name = request.Name.Trim(),
                Description = string.IsNullOrWhiteSpace(request.Description)
                    ? null
                    : request.Description.Trim(),
                Price = request.Price,
                Stock = request.Stock
            };

            await _productRepository.AddAsync(product, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product created with id {ProductId}", product.Id);
            return Result.Success(MapToResponse(product));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return Result.Failure<ProductResponse>(
                new Error("Product.CreateFailed", "Error al crear el producto"));
        }
    }

    public async Task<Result> UpdateAsync(int id, ProductRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var validationResult = ValidateProductRequest(request);
            if (validationResult.IsFailure)
            {
                return validationResult;
            }

            var product = await _productRepository.GetByIdAsync(id, cancellationToken);

            if (product is null)
            {
                _logger.LogWarning("Product with id {ProductId} not found for update", id);
                return Result.Failure(DomainErrors.Product.NotFound(id));
            }

            product.Name = request.Name.Trim();
            product.Description = string.IsNullOrWhiteSpace(request.Description)
                ? null
                : request.Description.Trim();
            product.Price = request.Price;
            product.Stock = request.Stock;

            _productRepository.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product {ProductId} updated successfully", id);
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {ProductId}", id);
            return Result.Failure(
                new Error("Product.UpdateFailed", "Error al actualizar el producto"));
        }
    }

    public async Task<Result> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var product = await _productRepository.GetByIdAsync(id, cancellationToken);

            if (product is null)
            {
                _logger.LogWarning("Product with id {ProductId} not found for deletion", id);
                return Result.Failure(DomainErrors.Product.NotFound(id));
            }

            _productRepository.Delete(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product {ProductId} deleted successfully", id);
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {ProductId}", id);
            return Result.Failure(
                new Error("Product.DeleteFailed", "Error al eliminar el producto"));
        }
    }

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

    private static Result ValidateProductRequest(ProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Result.Failure(DomainErrors.Product.NameRequired);
        }

        if (request.Price < 0)
        {
            return Result.Failure(DomainErrors.Product.NegativePrice);
        }

        if (request.Stock < 0)
        {
            return Result.Failure(DomainErrors.Product.NegativeStock);
        }

        return Result.Success();
    }
}
