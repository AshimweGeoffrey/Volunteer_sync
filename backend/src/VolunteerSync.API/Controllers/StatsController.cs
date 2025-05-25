using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VolunteerSync.Application.Services.Interfaces;

namespace VolunteerSync.API.Controllers;

public class StatsController : BaseController
{
    private readonly IStatsService _statsService;

    public StatsController(IStatsService statsService)
    {
        _statsService = statsService;
    }

    [HttpGet("dashboard")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDashboardStats()
    {
        var result = await _statsService.GetDashboardStatsAsync();
        return CreateResponse(result);
    }
}
