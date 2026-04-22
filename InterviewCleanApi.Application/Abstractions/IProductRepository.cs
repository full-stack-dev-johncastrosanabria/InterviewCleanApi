using InterviewCleanApi.Domain.Common;
using InterviewCleanApi.Domain.Entities;

namespace InterviewCleanApi.Application.Abstractions;

/// <summary>
///     Persists and retrieves product entities from the database.
/// </summary>
public interface IProductRepository : IRepository<Product>
{
    /// <summary>
    ///     Checks if a product with the given name already exists.
    /// </summary>
    Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default);

    /// <summary>
    ///     Gets products with low stock (below threshold).
    /// </summary>
    Task<IReadOnlyList<Product>> GetLowStockProductsAsync(int threshold, CancellationToken cancellationToken = default);
}