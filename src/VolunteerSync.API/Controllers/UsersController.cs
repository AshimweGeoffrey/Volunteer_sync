using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VolunteerSync.Application.DTOs.Users;
using VolunteerSync.Application.Services.Interfaces;

namespace VolunteerSync.API.Controllers;

[Authorize]
public class UsersController : BaseController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();
        var result = await _userService.GetByIdAsync(userId);
        
        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] CreateUserDto updateUserDto)
    {
        var userId = GetCurrentUserId();
        var result = await _userService.UpdateAsync(userId, updateUserDto);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _userService.GetByIdAsync(id);
        
        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _userService.GetAllAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string searchTerm, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _userService.SearchAsync(searchTerm, page, pageSize);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SystemAdmin")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _userService.DeleteAsync(id);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
