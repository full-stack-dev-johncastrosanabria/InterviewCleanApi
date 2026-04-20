using InterviewCleanApi.Domain.Entities;

namespace InterviewCleanApi.Application.Abstractions;

/// <summary>
///     Persists and queries application users.
/// </summary>
public interface IUserRepository
{
    /// <summary>
    ///     Finds a user by normalized email address.
    /// </summary>
    Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken);

    /// <summary>
    ///     Creates a new user.
    /// </summary>
    Task AddAsync(AppUser user, CancellationToken cancellationToken);

    /// <summary>
    ///     Executes pending user changes to the database.
    /// </summary>
    Task SaveChangesAsync(CancellationToken cancellationToken);
}