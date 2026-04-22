namespace InterviewCleanApi.Domain.Constants;

/// <summary>
///     Contains security-related constants.
/// </summary>
public static class SecurityConstants
{
    public const string AdminRole = "Admin";
    public const string UserRole = "User";
    
    public static class ClaimTypes
    {
        public const string UserId = "userId";
        public const string Email = "email";
        public const string Role = "role";
    }
}
