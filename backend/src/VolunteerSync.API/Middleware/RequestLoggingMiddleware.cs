namespace VolunteerSync.API.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var startTime = DateTime.UtcNow;
        
        _logger.LogInformation("Incoming request: {Method} {Path} from {RemoteIpAddress}",
            context.Request.Method,
            context.Request.Path,
            context.Connection.RemoteIpAddress);

        await _next(context);

        var elapsed = DateTime.UtcNow - startTime;
        
        _logger.LogInformation("Completed request: {Method} {Path} - Status: {StatusCode} - Duration: {Duration}ms",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            elapsed.TotalMilliseconds);
    }
}
