using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Products;
using InterviewCleanApi.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InterviewCleanApi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    /// <summary>
    ///     Returns all products visible to authenticated users.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _productService.GetAllAsync(cancellationToken);

        if (result.IsFailure)
        {
            return Problem(
                statusCode: StatusCodes.Status500InternalServerError,
                title: result.Error.Code,
                detail: result.Error.Message);
        }

        return Ok(result.Value);
    }

    /// <summary>
    ///     Returns a single product or 404 when it does not exist.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _productService.GetByIdAsync(id, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code == "Error.NotFound"
                ? NotFound(new { error = result.Error.Message })
                : Problem(
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: result.Error.Code,
                    detail: result.Error.Message);
        }

        return Ok(result.Value);
    }

    /// <summary>
    ///     Creates a product; restricted to administrators.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] ProductRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _productService.CreateAsync(request, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code == "Error.Validation"
                ? BadRequest(new { error = result.Error.Message })
                : Problem(
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: result.Error.Code,
                    detail: result.Error.Message);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
    }

    /// <summary>
    ///     Updates a product; restricted to administrators.
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] ProductRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _productService.UpdateAsync(id, request, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code == "Error.NotFound"
                ? NotFound(new { error = result.Error.Message })
                : result.Error.Code == "Error.Validation"
                    ? BadRequest(new { error = result.Error.Message })
                    : Problem(
                        statusCode: StatusCodes.Status500InternalServerError,
                        title: result.Error.Code,
                        detail: result.Error.Message);
        }

        return NoContent();
    }

    /// <summary>
    ///     Deletes a product; restricted to administrators.
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var result = await _productService.DeleteAsync(id, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code == "Error.NotFound"
                ? NotFound(new { error = result.Error.Message })
                : Problem(
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: result.Error.Code,
                    detail: result.Error.Message);
        }

        return NoContent();
    }
}