namespace InterviewCleanApi.Domain.Constants;

/// <summary>
///     Contains validation constants used across the domain.
/// </summary>
public static class ValidationConstants
{
    public static class User
    {
        public const int MinUserNameLength = 3;
        public const int MaxUserNameLength = 50;
        public const int MinPasswordLength = 6;
        public const int MaxPasswordLength = 100;
        public const int MaxEmailLength = 255;
    }

    public static class Product
    {
        public const int MinNameLength = 3;
        public const int MaxNameLength = 200;
        public const int MaxDescriptionLength = 1000;
        public const decimal MinPrice = 0;
        public const int MinStock = 0;
    }
}
