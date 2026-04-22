using System.ComponentModel.DataAnnotations;

namespace InterviewCleanApi.Application.DTOs.Auth;

/// <summary>
///     Carries the credentials required to authenticate an existing user.
/// </summary>
public sealed record LoginRequest(
    [Required(ErrorMessage = "El correo es requerido")]
    [EmailAddress(ErrorMessage = "El formato del correo es inválido")]
    string Email,

    [Required(ErrorMessage = "La contraseña es requerida")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    string Password
);