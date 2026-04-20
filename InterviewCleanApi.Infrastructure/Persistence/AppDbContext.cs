using InterviewCleanApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InterviewCleanApi.Infrastructure.Persistence;

/// <summary>
///     EF Core database context that maps domain entities to the MySQL schema.
/// </summary>
public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    /// <summary>
    ///     Users table projection.
    /// </summary>
    public DbSet<AppUser> Users => Set<AppUser>();

    /// <summary>
    ///     Products table projection.
    /// </summary>
    public DbSet<Product> Products => Set<Product>();

    /// <summary>
    ///     Configures table names, constraints, and column metadata for the domain model.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configures the user aggregate and enforces uniqueness on email addresses.
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.UserName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.Email)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(x => x.PasswordHash)
                .IsRequired();

            entity.Property(x => x.Role)
                .IsRequired();

            entity.Property(x => x.CreatedAtUtc)
                .IsRequired();

            entity.HasIndex(x => x.Email)
                .IsUnique();
        });

        // Configures product persistence rules used by the CRUD endpoints.
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(x => x.Description)
                .HasMaxLength(500);

            entity.Property(x => x.Price)
                .HasPrecision(18, 2);

            entity.Property(x => x.Stock)
                .IsRequired();

            entity.Property(x => x.CreatedAtUtc)
                .IsRequired();
        });
    }
}