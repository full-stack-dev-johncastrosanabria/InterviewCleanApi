using InterviewCleanApi.Application.Abstractions;
using InterviewCleanApi.Application.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;

namespace InterViewCleanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>
    ///     Registers a new user account.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        await authService.RegisterAsync(request, cancellationToken);
        return NoContent();
    }

    /// <summary>
    ///     Authenticates a user and returns a JWT token response.
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var response = await authService.LoginAsync(request, cancellationToken);
        return Ok(response);
    }
}