using InterviewCleanApi.Domain.Common;

namespace InterviewCleanApi.Domain.Errors;

/// <summary>
///     Contains all domain-specific errors organized by entity.
/// </summary>
public static class DomainErrors
{
    public static class Product
    {
        public static Error NotFound(int id) => Error.NotFound("Producto", id);
        public static Error NameRequired => Error.Validation("El nombre del producto es requerido");
        public static Error NegativePrice => Error.Validation("El precio no puede ser negativo");
        public static Error NegativeStock => Error.Validation("El stock no puede ser negativo");
    }

    public static class User
    {
        public static Error NotFound(string email) => new("User.NotFound", $"Usuario con email {email} no fue encontrado");
        public static Error EmailRequired => Error.Validation("El correo es requerido");
        public static Error UserNameRequired => Error.Validation("El nombre de usuario es requerido");
        public static Error PasswordTooShort => Error.Validation("La contraseña debe tener al menos 6 caracteres");
        public static Error EmailAlreadyExists => Error.Conflict("El correo ya está registrado");
        public static Error InvalidCredentials => Error.Unauthorized("Credenciales inválidas");
    }

    public static class Auth
    {
        public static Error InvalidToken => Error.Unauthorized("Token inválido");
        public static Error TokenExpired => Error.Unauthorized("Token expirado");
    }
}
