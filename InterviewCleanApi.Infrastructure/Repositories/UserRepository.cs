using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InterviewCleanApi.Infrastructure.Repositories;

/// <summary>
///     EF Core implementation for user persistence operations.
/// </summary>
public sealed class UserRepository : Repository<AppUser>, IUserRepository
{
    public UserRepository(AppDbContext dbContext) : base(dbContext)
    {
    }

    /// <summary>
    ///     Retrieves a user by normalized email address.
    /// </summary>
    public async Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await DbSet.FirstOrDefaultAsync(
            x => x.Email == email,
            cancellationToken);
    }

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await DbSet.AnyAsync(u => u.Email == email, cancellationToken);
    }
}