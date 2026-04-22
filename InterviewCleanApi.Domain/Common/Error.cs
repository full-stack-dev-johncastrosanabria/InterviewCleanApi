namespace InterviewCleanApi.Domain.Common;

/// <summary>
///     Represents an error with a code and message.
/// </summary>
public sealed record Error(string Code, string Message)
{
    public static readonly Error None = new(string.Empty, string.Empty);
    public static readonly Error NullValue = new("Error.NullValue", "El valor especificado es nulo");

    public static Error NotFound(string entity, object id) =>
        new("Error.NotFound", $"{entity} con id {id} no fue encontrado");

    public static Error Validation(string message) =>
        new("Error.Validation", message);

    public static Error Conflict(string message) =>
        new("Error.Conflict", message);

    public static Error Unauthorized(string message = "No autorizado") =>
        new("Error.Unauthorized", message);
}
