using InterviewCleanApi.Application.DTOs.Auth;
using InterviewCleanApi.Domain.Common;

namespace InterviewCleanApi.Application.Abstractions;

/// <summary>
///     Defines the use cases for registering users and issuing login tokens.
/// </summary>
public interface IAuthService
{
    /// <summary>
    ///     Creates a new user account after validating the incoming registration data.
    /// </summary>
    Task<Result> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    ///     Authenticates a user and returns the JWT payload for the client.
    /// </summary>
    Task<Result<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}