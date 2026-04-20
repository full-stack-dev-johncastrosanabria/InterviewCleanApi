namespace InterviewCleanApi.Application.DTOs.Products;

/// <summary>
///     Represents the client payload used to create or update a product.
/// </summary>
public sealed record ProductRequest(
    string Name,
    string? Description,
    decimal Price,
    int Stock
);