namespace InterviewCleanApi.Application.DTOs.Auth;

/// <summary>
///     Returns the signed JWT together with its expiration timestamp.
/// </summary>
public sealed record LoginResponse(
    string Token,
    DateTime ExpiresAtUtc
);