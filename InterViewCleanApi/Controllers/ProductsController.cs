using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InterViewCleanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ProductsController(IProductService productService) : ControllerBase
{
    /// <summary>
    ///     Returns all products visible to authenticated users.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var products = await productService.GetAllAsync(cancellationToken);
        return Ok(products);
    }

    /// <summary>
    ///     Returns a single product or 404 when it does not exist.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var product = await productService.GetByIdAsync(id, cancellationToken);
        return product is null ? NotFound() : Ok(product);
    }

    /// <summary>
    ///     Creates a product; restricted to administrators.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(ProductRequest request, CancellationToken cancellationToken)
    {
        var created = await productService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    ///     Updates a product; restricted to administrators.
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, ProductRequest request, CancellationToken cancellationToken)
    {
        var updated = await productService.UpdateAsync(id, request, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    /// <summary>
    ///     Deletes a product; restricted to administrators.
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await productService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}