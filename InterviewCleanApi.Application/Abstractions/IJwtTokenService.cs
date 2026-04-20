using InterviewCleanApi.Application.DTOs.Auth;
using InterviewCleanApi.Domain.Entities;

namespace InterviewCleanApi.Application.Abstractions;

/// <summary>
///     Encapsulates JWT generation so authentication logic stays independent of token details.
/// </summary>
public interface IJwtTokenService
{
    /// <summary>
    ///     Builds the signed token response for an authenticated user.
    /// </summary>
    LoginResponse CreateToken(AppUser user);
}