using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InterviewCleanApi.Infrastructure.Repositories;

/// <summary>
///     EF Core implementation for user persistence operations.
/// </summary>
public sealed class UserRepository(AppDbContext dbContext) : IUserRepository
{
    /// <summary>
    ///     Retrieves a user by normalized email address.
    /// </summary>
    public Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return dbContext.Users.FirstOrDefaultAsync(
            x => x.Email == email,
            cancellationToken);
    }

    /// <summary>
    ///     Adds a new user to the current EF Core unit of work.
    /// </summary>
    public Task AddAsync(AppUser user, CancellationToken cancellationToken)
    {
        return dbContext.Users.AddAsync(user, cancellationToken).AsTask();
    }

    /// <summary>
    ///     Persists pending user changes to the database.
    /// </summary>
    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        return dbContext.SaveChangesAsync(cancellationToken);
    }
}