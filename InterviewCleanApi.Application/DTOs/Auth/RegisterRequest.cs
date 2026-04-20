namespace InterviewCleanApi.Application.DTOs.Auth;

/// <summary>
///     Carries the data required to create a new user account.
/// </summary>
public sealed record RegisterRequest(
    string UserName,
    string Email,
    string Password
);