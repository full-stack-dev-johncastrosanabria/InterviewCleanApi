using InterviewCleanApi.Domain.Common;

namespace InterviewCleanApi.Infrastructure.Persistence;

/// <summary>
///     Implements the Unit of Work pattern for managing database transactions.
/// </summary>
public sealed class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _dbContext;

    public UnitOfWork(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
