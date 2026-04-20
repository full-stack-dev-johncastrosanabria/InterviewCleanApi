namespace InterviewCleanApi.Application.DTOs.Products;

/// <summary>
///     Represents the product data exposed by the API.
/// </summary>
public sealed record ProductResponse(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int Stock,
    DateTime CreatedAtUtc
);