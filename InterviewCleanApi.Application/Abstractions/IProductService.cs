using InterviewCleanApi.Application.DTOs.Products;
using InterviewCleanApi.Domain.Common;

namespace InterviewCleanApi.Application.Abstractions;

/// <summary>
///     Defines product business operations.
/// </summary>
public interface IProductService
{
    /// <summary>
    ///     Returns the complete product catalog.
    /// </summary>
    Task<Result<IReadOnlyList<ProductResponse>>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    ///     Returns a single product DTO when it exists.
    /// </summary>
    Task<Result<ProductResponse>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    ///     Creates a product from client input and returns the created DTO.
    /// </summary>
    Task<Result<ProductResponse>> CreateAsync(ProductRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    ///     Updates an existing product.
    /// </summary>
    Task<Result> UpdateAsync(int id, ProductRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    ///     Deletes an existing product.
    /// </summary>
    Task<Result> DeleteAsync(int id, CancellationToken cancellationToken = default);
}