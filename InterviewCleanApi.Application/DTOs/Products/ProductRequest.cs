using System.ComponentModel.DataAnnotations;

namespace InterviewCleanApi.Application.DTOs.Products;

/// <summary>
///     Represents the client payload used to create or update a product.
/// </summary>
public sealed record ProductRequest(
    [Required(ErrorMessage = "El nombre del producto es requerido")]
    [MinLength(3, ErrorMessage = "El nombre debe tener al menos 3 caracteres")]
    [MaxLength(200, ErrorMessage = "El nombre no puede exceder 200 caracteres")]
    string Name,

    [MaxLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    string? Description,

    [Range(0, double.MaxValue, ErrorMessage = "El precio no puede ser negativo")]
    decimal Price,

    [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
    int Stock
);