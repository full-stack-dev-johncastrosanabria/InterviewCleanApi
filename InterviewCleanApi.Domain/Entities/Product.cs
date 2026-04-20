using InterviewCleanApi.Domain.Common;

namespace InterviewCleanApi.Domain.Entities;

/// <summary>
///     Represents a product managed through the protected CRUD API.
/// </summary>
public sealed class Product : BaseEntity
{
    /// <summary>
    ///     product name.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    ///     Optional description for Products.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    ///     Unit price stored with two decimal places in persistence.
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    ///     Available inventory count.
    /// </summary>
    public int Stock { get; set; }
}