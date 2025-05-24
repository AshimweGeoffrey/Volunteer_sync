using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VolunteerSync.Application.DTOs.Organizations;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.API.Controllers.Base;

namespace VolunteerSync.API.Controllers;

[Authorize]
public class OrganizationsController : BaseController
{
    private readonly IOrganizationService _organizationService;

    public OrganizationsController(IOrganizationService organizationService)
    {
        _organizationService = organizationService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllOrganizations([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _organizationService.GetAllAsync(page, pageSize);
        return CreateResponse(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOrganization(string id)
    {
        var result = await _organizationService.GetByIdAsync(id);
        return CreateResponse(result);
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> CreateOrganization([FromBody] CreateOrganizationDto createOrganizationDto)
    {
        var result = await _organizationService.CreateAsync(createOrganizationDto);
        return CreateResponse(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> UpdateOrganization(string id, [FromBody] CreateOrganizationDto updateOrganizationDto)
    {
        var result = await _organizationService.UpdateAsync(id, updateOrganizationDto);
        return CreateResponse(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> DeleteOrganization(string id)
    {
        var result = await _organizationService.DeleteAsync(id);
        return CreateResponse(result);
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchOrganizations([FromQuery] string searchTerm, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _organizationService.SearchAsync(searchTerm, page, pageSize);
        return CreateResponse(result);
    }

    [HttpGet("{id}/members")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin,OrganizationMember")]
    public async Task<IActionResult> GetOrganizationMembers(string id)
    {
        var result = await _organizationService.GetMembersAsync(id);
        return CreateResponse(result);
    }

    [HttpPost("{id}/members/{userId}")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> AddMember(string id, string userId)
    {
        var result = await _organizationService.AddMemberAsync(id, userId);
        return CreateResponse(result);
    }

    [HttpDelete("{id}/members/{userId}")]
    [Authorize(Roles = "SuperAdmin,OrganizationAdmin")]
    public async Task<IActionResult> RemoveMember(string id, string userId)
    {
        var result = await _organizationService.RemoveMemberAsync(id, userId);
        return CreateResponse(result);
    }

    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeaturedOrganizations()
    {
        var result = await _organizationService.GetFeaturedAsync();
        return CreateResponse(result);
    }
}
