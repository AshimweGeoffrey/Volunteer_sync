using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VolunteerSync.Application.DTOs.Common;

namespace VolunteerSync.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected string GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
    }

    protected string GetCurrentUserEmail()
    {
        return User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;
    }

    protected string GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
    }

    protected bool IsAuthenticated()
    {
        return User.Identity?.IsAuthenticated ?? false;
    }

    protected IActionResult CreateResponse<T>(ApiResponseDto<T> response)
    {
        if (response.IsSuccess)
        {
            return Ok(response);
        }

        return BadRequest(response);
    }
}
