using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Auth;
using InterviewCleanApi.Domain.Common;
using Microsoft.AspNetCore.Mvc;

namespace InterviewCleanApi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    /// <summary>
    ///     Registers a new user account.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.RegisterAsync(request, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code == "Error.Validation" || result.Error.Code == "Error.Conflict"
                ? BadRequest(new { error = result.Error.Message })
                : Problem(
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: result.Error.Code,
                    detail: result.Error.Message);
        }

        return NoContent();
    }

    /// <summary>
    ///     Authenticates a user and returns a JWT token response.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.LoginAsync(request, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code == "Error.Unauthorized"
                ? Unauthorized(new { error = result.Error.Message })
                : Problem(
                    statusCode: StatusCodes.Status500InternalServerError,
                    title: result.Error.Code,
                    detail: result.Error.Message);
        }

        return Ok(result.Value);
    }
}