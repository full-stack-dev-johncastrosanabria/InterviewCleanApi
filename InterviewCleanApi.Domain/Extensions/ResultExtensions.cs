using InterviewCleanApi.Domain.Common;

namespace InterviewCleanApi.Domain.Extensions;

/// <summary>
///     Extension methods for Result pattern.
/// </summary>
public static class ResultExtensions
{
    /// <summary>
    ///     Maps a successful result to a new type.
    /// </summary>
    public static Result<TOut> Map<TIn, TOut>(
        this Result<TIn> result,
        Func<TIn, TOut> mapper)
    {
        return result.IsSuccess
            ? Result.Success(mapper(result.Value))
            : Result.Failure<TOut>(result.Error);
    }

    /// <summary>
    ///     Binds a result to another operation that returns a result.
    /// </summary>
    public static async Task<Result<TOut>> Bind<TIn, TOut>(
        this Result<TIn> result,
        Func<TIn, Task<Result<TOut>>> func)
    {
        return result.IsSuccess
            ? await func(result.Value)
            : Result.Failure<TOut>(result.Error);
    }

    /// <summary>
    ///     Matches a result to one of two functions based on success or failure.
    /// </summary>
    public static TOut Match<TIn, TOut>(
        this Result<TIn> result,
        Func<TIn, TOut> onSuccess,
        Func<Error, TOut> onFailure)
    {
        return result.IsSuccess
            ? onSuccess(result.Value)
            : onFailure(result.Error);
    }
}
