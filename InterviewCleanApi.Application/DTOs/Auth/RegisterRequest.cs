using System.ComponentModel.DataAnnotations;

namespace InterviewCleanApi.Application.DTOs.Auth;

/// <summary>
///     Carries the data required to create a new user account.
/// </summary>
public sealed record RegisterRequest(
    [Required(ErrorMessage = "El nombre de usuario es requerido")]
    [MinLength(3, ErrorMessage = "El nombre de usuario debe tener al menos 3 caracteres")]
    [MaxLength(50, ErrorMessage = "El nombre de usuario no puede exceder 50 caracteres")]
    string UserName,

    [Required(ErrorMessage = "El correo es requerido")]
    [EmailAddress(ErrorMessage = "El formato del correo es inválido")]
    string Email,

    [Required(ErrorMessage = "La contraseña es requerida")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    [MaxLength(100, ErrorMessage = "La contraseña no puede exceder 100 caracteres")]
    string Password
);