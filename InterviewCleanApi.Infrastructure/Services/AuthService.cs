using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Auth;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace InterviewCleanApi.Infrastructure.Services;

public sealed class AuthService(
    IUserRepository userRepository,
    IPasswordHasher<AppUser> passwordHasher,
    IJwtTokenService jwtTokenService) : IAuthService
{
    /// <summary>
    ///     Validates registration values, hashes the password, and saves the new user.
    /// </summary>
    public async Task RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        // Normalizes user input before validations and unique-email checks.
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var normalizedUserName = request.UserName.Trim();

        if (string.IsNullOrWhiteSpace(normalizedUserName))
            throw new InvalidOperationException("El nombre de usuario es requerido.");

        if (string.IsNullOrWhiteSpace(normalizedEmail))
            throw new InvalidOperationException("El correo es requerido.");

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            throw new InvalidOperationException("La contraseña debe tener al menos 6 caracteres");

        var existingUser = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (existingUser is not null)
            throw new InvalidOperationException("Ha ocurrido un error, vuelva a intentar.");

        // Adds the user as admin so protected CRUD operations are accessible during practice.
        var user = new AppUser
        {
            UserName = normalizedUserName,
            Email = normalizedEmail,
            Role = UserRole.Admin,
            PasswordHash = string.Empty
        };

        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        await userRepository.AddAsync(user, cancellationToken);
        await userRepository.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    ///     Verifies credentials and transfer token creation to the JWT service.
    /// </summary>
    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (user is null)
            throw new UnauthorizedAccessException("Credenciales inválidas");

        var verificationResult = passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password
        );

        if (verificationResult == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Credenciales inválidas");

        return jwtTokenService.CreateToken(user);
    }
}