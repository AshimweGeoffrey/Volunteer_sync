namespace VolunteerSync.Application.DTOs.Common;

public class ApiResponseDto<T>
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();

    public static ApiResponseDto<T> Success(T data, string message = "Success")
    {
        return new ApiResponseDto<T>
        {
            IsSuccess = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponseDto<T> Failure(string message, int statusCode = 500, List<string>? errors = null)
    {
        return new ApiResponseDto<T>
        {
            IsSuccess = false,
            Message = message,
            Errors = errors ?? new List<string>()
        };
    }

    public static ApiResponseDto<T> ErrorResponse(string message, List<string>? errors = null)
    {
        return new ApiResponseDto<T>
        {
            IsSuccess = false,
            Message = message,
            Errors = errors ?? new List<string>()
        };
    }
}
