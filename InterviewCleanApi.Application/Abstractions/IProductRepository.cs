using InterviewCleanApi.Domain.Entities;

namespace InterviewCleanApi.Application.Abstractions;

/// <summary>
///     Persists and retrieves product entities from the database.
/// </summary>
public interface IProductRepository
{
    /// <summary>
    ///     Returns every product ordered according to the repository implementation.
    /// </summary>
    Task<List<Product>> GetAllAsync(CancellationToken cancellationToken);

    /// <summary>
    ///     Looks up a single product by its identifier.
    /// </summary>
    Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken);

    /// <summary>
    ///     Stages a new product for insertion.
    /// </summary>
    Task AddAsync(Product product, CancellationToken cancellationToken);

    /// <summary>
    ///     Modifies and existing product.
    /// </summary>
    void Update(Product product);

    /// <summary>
    ///     Deletes a product
    /// </summary>
    void Delete(Product product);

    /// <summary>
    ///     Executes pending repository changes to the database.
    /// </summary>
    Task SaveChangesAsync(CancellationToken cancellationToken);
}