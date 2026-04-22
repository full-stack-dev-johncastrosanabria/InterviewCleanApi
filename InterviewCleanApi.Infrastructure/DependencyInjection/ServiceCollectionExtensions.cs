using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Domain.Common;
using InterviewCleanApi.Domain.Entities;
using InterviewCleanApi.Infrastructure.Persistence;
using InterviewCleanApi.Infrastructure.Repositories;
using InterviewCleanApi.Infrastructure.Security;
using InterviewCleanApi.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace InterviewCleanApi.Infrastructure.DependencyInjection;

/// <summary>
///     Registers infrastructure services, repositories, security, and persistence dependencies.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    ///     Sets the infrastructure layer into the application service collection.
    /// </summary>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("La cadena de conexión DefaultConnection no está configurada.");

        // Configuration
        services.Configure<JwtOptions>(
            configuration.GetSection(JwtOptions.SectionName));

        // Database
        services.AddDbContext<AppDbContext>(options =>
            options.UseMySQL(connectionString));

        // Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();

        // Application Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProductService, ProductService>();

        // Infrastructure Services
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();

        return services;
    }
}
