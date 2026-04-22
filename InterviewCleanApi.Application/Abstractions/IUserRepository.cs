using InterviewCleanApi.Domain.Common;
using InterviewCleanApi.Domain.Entities;

namespace InterviewCleanApi.Application.Abstractions;

/// <summary>
///     Persists and queries application users.
/// </summary>
public interface IUserRepository : IRepository<AppUser>
{
    /// <summary>
    ///     Finds a user by normalized email address.
    /// </summary>
    Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    ///     Checks if a user with the given email already exists.
    /// </summary>
    Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
}