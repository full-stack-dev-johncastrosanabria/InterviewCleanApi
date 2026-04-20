using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InterviewCleanApi.Infrastructure.Repositories;

/// <summary>
///     EF Core implementation for product persistence.
/// </summary>
public sealed class ProductRepository(AppDbContext dbContext) : IProductRepository
{
    /// <summary>
    ///     Returns products ordered by name to keep responses predictable.
    /// </summary>
    public Task<List<Product>> GetAllAsync(CancellationToken cancellationToken)
    {
        return dbContext.Products
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    ///     Loads a single product by id.
    /// </summary>
    public Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return dbContext.Products
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken
            );
    }

    /// <summary>
    ///     Adds a new product to EF Core.
    /// </summary>
    public Task AddAsync(Product product, CancellationToken cancellationToken)
    {
        return dbContext.Products.AddAsync(product, cancellationToken).AsTask();
    }

    /// <summary>
    ///     Modifies an existing product
    /// </summary>
    public void Update(Product product)
    {
        dbContext.Products.Update(product);
    }

    /// <summary>
    ///     Deletes a product.
    /// </summary>
    public void Delete(Product product)
    {
        dbContext.Products.Remove(product);
    }

    /// <summary>
    ///     Persists product changes to the database.
    /// </summary>
    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        return dbContext.SaveChangesAsync(cancellationToken);
    }
}