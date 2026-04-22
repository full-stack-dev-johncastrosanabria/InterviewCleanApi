namespace InterviewCleanApi.Domain.Common;

/// <summary>
///     Defines a unit of work for managing database transactions.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    ///     Saves all pending changes to the database.
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
