using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InterviewCleanApi.Infrastructure.Repositories;

/// <summary>
///     EF Core implementation for product persistence.
/// </summary>
public sealed class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext dbContext) : base(dbContext)
    {
    }

    /// <summary>
    ///     Returns products ordered by name to keep responses predictable.
    /// </summary>
    public override async Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await DbSet.AnyAsync(p => p.Name == name, cancellationToken);
    }

    public async Task<IReadOnlyList<Product>> GetLowStockProductsAsync(int threshold, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(p => p.Stock < threshold)
            .OrderBy(p => p.Stock)
            .ToListAsync(cancellationToken);
    }
}