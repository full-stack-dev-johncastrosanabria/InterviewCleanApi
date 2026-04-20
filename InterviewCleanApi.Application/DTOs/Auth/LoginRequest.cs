namespace InterviewCleanApi.Application.DTOs.Auth;

/// <summary>
///     Carries the credentials required to authenticate an existing user.
/// </summary>
public sealed record LoginRequest(
    string Email,
    string Password
);