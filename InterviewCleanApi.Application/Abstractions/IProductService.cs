using InterviewCleanApi.Application.DTOs.Products;

namespace InterviewCleanApi.Application.Abstractions;

public interface IProductService
{
    /// <summary>
    ///     Returns the complete product catalog.
    /// </summary>
    Task<IReadOnlyCollection<ProductResponse>> GetAllAsync(CancellationToken cancellationToken);

    /// <summary>
    ///     Returns a single product DTO when it exists.
    /// </summary>
    Task<ProductResponse?> GetByIdAsync(int id, CancellationToken cancellationToken);

    /// <summary>
    ///     Creates a product from client input and returns the created DTO.
    /// </summary>
    Task<ProductResponse> CreateAsync(ProductRequest request, CancellationToken cancellationToken);

    /// <summary>
    ///     Updates an existing product and reports whether the target record was found.
    /// </summary>
    Task<bool> UpdateAsync(int id, ProductRequest request, CancellationToken cancellationToken);

    /// <summary>
    ///     Deletes an existing product and reports whether the target record was found.
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
}