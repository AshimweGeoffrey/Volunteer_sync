using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VolunteerSync.Application.DTOs.Tasks;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Enums;
using VolunteerSync.API.Controllers.Base;

namespace VolunteerSync.API.Controllers;

[Authorize]
public class TasksController : BaseController
{
    private readonly IVolunteerTaskService _taskService;

    public TasksController(IVolunteerTaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllTasks([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _taskService.GetAllAsync(page, pageSize);
        return CreateResponse(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTask(string id)
    {
        var result = await _taskService.GetByIdAsync(id);
        return CreateResponse(result);
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin,OrganizationMember")]
    public async Task<IActionResult> CreateTask([FromBody] CreateVolunteerTaskDto createTaskDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var result = await _taskService.CreateAsync(createTaskDto, userId);
        return CreateResponse(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin,OrganizationMember")]
    public async Task<IActionResult> UpdateTask(string id, [FromBody] CreateVolunteerTaskDto updateTaskDto)
    {
        var result = await _taskService.UpdateAsync(id, updateTaskDto);
        return CreateResponse(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> DeleteTask(string id)
    {
        var result = await _taskService.DeleteAsync(id);
        return CreateResponse(result);
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchTasks([FromQuery] string searchTerm, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _taskService.SearchAsync(searchTerm, page, pageSize);
        return CreateResponse(result);
    }

    [HttpGet("organization/{organizationId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTasksByOrganization(string organizationId)
    {
        var result = await _taskService.GetByOrganizationAsync(organizationId);
        return CreateResponse(result);
    }

    [HttpGet("created-by/{userId}")]
    [Authorize]
    public async Task<IActionResult> GetTasksByCreatedBy(string userId)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Users can only see their own created tasks unless they're admin
        if (currentUserId != userId && userRole != "SuperAdmin" && userRole != "OrganizationAdmin")
        {
            return Forbid("You can only view your own created tasks");
        }

        var result = await _taskService.GetByCreatedByAsync(userId);
        return CreateResponse(result);
    }

    [HttpGet("category/{category}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTasksByCategory(TaskCategory category)
    {
        var result = await _taskService.GetByCategoryAsync(category);
        return CreateResponse(result);
    }

    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeaturedTasks()
    {
        var result = await _taskService.GetFeaturedAsync();
        return CreateResponse(result);
    }

    [HttpPost("{id}/register")]
    [Authorize]
    public async Task<IActionResult> RegisterForTask(string id, [FromBody] RegisterForTaskDto registerDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var result = await _taskService.RegisterForTaskAsync(id, userId, registerDto.ApplicationMessage);
        return CreateResponse(result);
    }

    [HttpDelete("{id}/register")]
    [Authorize]
    public async Task<IActionResult> UnregisterFromTask(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var result = await _taskService.UnregisterFromTaskAsync(id, userId);
        return CreateResponse(result);
    }
}

public class RegisterForTaskDto
{
    public string ApplicationMessage { get; set; } = string.Empty;
}
