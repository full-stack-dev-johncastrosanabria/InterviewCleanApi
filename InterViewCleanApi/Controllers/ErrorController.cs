using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace InterViewCleanApi.Controllers;

[ApiController]
public sealed class ErrorController : ControllerBase
{
    /// <summary>
    ///     Maps known exception types to status codes and returns a standardized problem payload.
    /// </summary>
    [Route("/error")]
    public IActionResult HandleError()
    {
        var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
        var exception = exceptionFeature?.Error;

        var statusCode = exception switch
        {
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            InvalidOperationException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        return Problem(
            title: "Se produjo un error.",
            detail: exception?.Message,
            statusCode: statusCode);
    }
}