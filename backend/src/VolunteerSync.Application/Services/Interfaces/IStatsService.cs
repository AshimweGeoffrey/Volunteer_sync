using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Stats;

namespace VolunteerSync.Application.Services.Interfaces;

public interface IStatsService
{
    Task<ApiResponseDto<DashboardStatsDto>> GetDashboardStatsAsync();
}
