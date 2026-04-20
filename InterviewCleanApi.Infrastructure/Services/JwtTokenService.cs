using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Auth;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Infrastructure.Security;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace InterviewCleanApi.Infrastructure.Services;

/// <summary>
///     Creates signed JWT tokens from the configured security settings.
/// </summary>
public sealed class JwtTokenService(IOptions<JwtOptions> options) : IJwtTokenService
{
    private readonly JwtOptions _jwtOptions = options.Value;

    /// <summary>
    ///     Creates a JWT containing the identity and authorization claims for the given user.
    /// </summary>
    public LoginResponse CreateToken(AppUser user)
    {
        var expiresAtUtc = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpirationMinutes);

        // Embeds the claims consumed by ASP.NET authorization policies.
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Role, user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _jwtOptions.Issuer,
            _jwtOptions.Audience,
            claims,
            expires: expiresAtUtc,
            signingCredentials: credentials
        );

        var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

        return new LoginResponse(tokenValue, expiresAtUtc);
    }
}