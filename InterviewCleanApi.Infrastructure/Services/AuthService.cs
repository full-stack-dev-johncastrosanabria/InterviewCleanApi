using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Auth;
using InterviewCleanApi.Domain.Common;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Domain.Enums;
using InterviewCleanApi.Domain.Errors;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace InterviewCleanApi.Infrastructure.Services;

/// <summary>
///     Implements authentication business logic using the Result pattern.
/// </summary>
public sealed class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<AppUser> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher<AppUser> passwordHasher,
        IJwtTokenService jwtTokenService,
        IUnitOfWork unitOfWork,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            var normalizedUserName = request.UserName.Trim();

            // Validate input
            if (string.IsNullOrWhiteSpace(normalizedUserName))
            {
                return Result.Failure(DomainErrors.User.UserNameRequired);
            }

            if (string.IsNullOrWhiteSpace(normalizedEmail))
            {
                return Result.Failure(DomainErrors.User.EmailRequired);
            }

            if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            {
                return Result.Failure(DomainErrors.User.PasswordTooShort);
            }

            // Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);
            if (existingUser is not null)
            {
                _logger.LogWarning("Registration attempt with existing email: {Email}", normalizedEmail);
                return Result.Failure(DomainErrors.User.EmailAlreadyExists);
            }

            // Create new user
            var user = new AppUser
            {
                UserName = normalizedUserName,
                Email = normalizedEmail,
                Role = UserRole.Admin, // For demo purposes
                PasswordHash = string.Empty
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            await _userRepository.AddAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("User registered successfully: {Email}", normalizedEmail);
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration");
            return Result.Failure(new Error("Auth.RegisterFailed", "Error al registrar el usuario"));
        }
    }

    public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            var user = await _userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

            if (user is null)
            {
                _logger.LogWarning("Login attempt with non-existent email: {Email}", normalizedEmail);
                return Result.Failure<LoginResponse>(DomainErrors.User.InvalidCredentials);
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password
            );

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                _logger.LogWarning("Failed login attempt for user: {Email}", normalizedEmail);
                return Result.Failure<LoginResponse>(DomainErrors.User.InvalidCredentials);
            }

            var loginResponse = _jwtTokenService.CreateToken(user);

            _logger.LogInformation("User logged in successfully: {Email}", normalizedEmail);
            return Result.Success(loginResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user login");
            return Result.Failure<LoginResponse>(
                new Error("Auth.LoginFailed", "Error al iniciar sesión"));
        }
    }
}
