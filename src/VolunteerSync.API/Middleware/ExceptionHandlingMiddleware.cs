using System.Text.Json;
using VolunteerSync.Application.Common.Exceptions;
using VolunteerSync.Application.DTOs.Common;

namespace VolunteerSync.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = exception switch
        {
            NotFoundException => new ApiResponseDto<object>
            {
                Success = false,
                Message = exception.Message,
                Data = null,
                Errors = new List<string> { exception.Message }
            },
            ValidationException validationEx => new ApiResponseDto<object>
            {
                Success = false,
                Message = "Validation failed",
                Data = null,
                Errors = validationEx.Errors.ToList()
            },
            UnauthorizedException => new ApiResponseDto<object>
            {
                Success = false,
                Message = "Unauthorized access",
                Data = null,
                Errors = new List<string> { exception.Message }
            },
            _ => new ApiResponseDto<object>
            {
                Success = false,
                Message = "An error occurred while processing your request",
                Data = null,
                Errors = new List<string> { "Internal server error" }
            }
        };

        context.Response.StatusCode = exception switch
        {
            NotFoundException => StatusCodes.Status404NotFound,
            ValidationException => StatusCodes.Status400BadRequest,
            UnauthorizedException => StatusCodes.Status401Unauthorized,
            _ => StatusCodes.Status500InternalServerError
        };

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
