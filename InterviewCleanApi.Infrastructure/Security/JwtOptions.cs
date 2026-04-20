namespace InterviewCleanApi.Infrastructure.Security;

/// <summary>
///     Binds the JWT configuration section from application settings.
/// </summary>
public sealed class JwtOptions
{
    /// <summary>
    ///     Configuration section name used by options binding.
    /// </summary>
    public const string SectionName = "Jwt";

    /// <summary>
    ///     Symmetric signing key used to issue tokens.
    /// </summary>
    public required string Key { get; set; }

    /// <summary>
    ///     Expected token issuer.
    /// </summary>
    public required string Issuer { get; set; }

    /// <summary>
    ///     Expected token audience.
    /// </summary>
    public required string Audience { get; set; }

    /// <summary>
    ///     Token expiration in minutes.
    /// </summary>
    public int ExpirationMinutes { get; set; }
}