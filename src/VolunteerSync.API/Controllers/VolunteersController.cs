using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VolunteerSync.Application.DTOs.Registrations;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Enums;
using VolunteerSync.API.Controllers.Base;

namespace VolunteerSync.API.Controllers;

[Authorize]
public class VolunteersController : BaseController
{
    private readonly ITaskRegistrationService _registrationService;

    public VolunteersController(ITaskRegistrationService registrationService)
    {
        _registrationService = registrationService;
    }

    [HttpGet("registrations")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetAllRegistrations([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _registrationService.GetAllAsync(page, pageSize);
        return CreateResponse(result);
    }

    [HttpGet("registrations/{id}")]
    [Authorize]
    public async Task<IActionResult> GetRegistration(string id)
    {
        var result = await _registrationService.GetByIdAsync(id);
        return CreateResponse(result);
    }

    [HttpPost("registrations")]
    [Authorize]
    public async Task<IActionResult> CreateRegistration([FromBody] CreateTaskRegistrationDto createRegistrationDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        // Ensure the user can only register themselves
        createRegistrationDto.UserId = userId;

        var result = await _registrationService.CreateAsync(createRegistrationDto);
        return CreateResponse(result);
    }

    [HttpPut("registrations/{id}/status")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> UpdateRegistrationStatus(string id, [FromBody] UpdateRegistrationStatusDto updateStatusDto)
    {
        var result = await _registrationService.UpdateStatusAsync(id, updateStatusDto.Status);
        return CreateResponse(result);
    }

    [HttpDelete("registrations/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteRegistration(string id)
    {
        var result = await _registrationService.DeleteAsync(id);
        return CreateResponse(result);
    }

    [HttpGet("tasks/{taskId}/registrations")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin,OrganizationMember")]
    public async Task<IActionResult> GetTaskRegistrations(string taskId)
    {
        var result = await _registrationService.GetByTaskIdAsync(taskId);
        return CreateResponse(result);
    }

    [HttpGet("users/{userId}/registrations")]
    [Authorize]
    public async Task<IActionResult> GetUserRegistrations(string userId)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Users can only see their own registrations unless they're admin
        if (currentUserId != userId && userRole != "SuperAdmin" && userRole != "OrganizationAdmin")
        {
            return Forbid("You can only view your own registrations");
        }

        var result = await _registrationService.GetByUserIdAsync(userId);
        return CreateResponse(result);
    }

    [HttpPost("registrations/{id}/approve")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> ApproveRegistration(string id)
    {
        var result = await _registrationService.ApproveRegistrationAsync(id);
        return CreateResponse(result);
    }

    [HttpPost("registrations/{id}/reject")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> RejectRegistration(string id, [FromBody] RejectRegistrationDto rejectDto)
    {
        var result = await _registrationService.RejectRegistrationAsync(id, rejectDto.Reason);
        return CreateResponse(result);
    }

    [HttpGet("organizations/{organizationId}/pending-registrations")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> GetPendingRegistrations(string organizationId)
    {
        var result = await _registrationService.GetPendingRegistrationsAsync(organizationId);
        return CreateResponse(result);
    }
}

public class UpdateRegistrationStatusDto
{
    public RegistrationStatus Status { get; set; }
}

public class RejectRegistrationDto
{
    public string Reason { get; set; } = string.Empty;
}
