using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Stats;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.Interfaces.Repositories;
using TaskStatus = VolunteerSync.Domain.Enums.TaskStatus;

namespace VolunteerSync.Application.Services.Implementations;

public class StatsService : IStatsService
{
    private readonly IUserRepository _userRepository;
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IVolunteerTaskRepository _taskRepository;

    public StatsService(
        IUserRepository userRepository,
        IOrganizationRepository organizationRepository,
        IVolunteerTaskRepository taskRepository)
    {
        _userRepository = userRepository;
        _organizationRepository = organizationRepository;
        _taskRepository = taskRepository;
    }

    public async Task<ApiResponseDto<DashboardStatsDto>> GetDashboardStatsAsync()
    {
        try
        {
            // Initialize stats with default values
            var stats = new DashboardStatsDto
            {
                TotalProjects = 0,
                TotalVolunteers = 0,
                TotalOrganizations = 0,
                CompletedProjects = 0,
                ActiveProjects = 0,
                UpcomingProjects = 0
            };

            try
            {
                // Get all organizations (this should work since we tested /api/organizations)
                var allOrganizations = await _organizationRepository.GetAllAsync();
                stats.TotalOrganizations = allOrganizations.Count();
            }
            catch (Exception ex)
            {
                // Continue with default value if organizations fail
                Console.WriteLine($"Organizations error: {ex.Message}");
            }

            try
            {
                // Get all tasks (this should work since we tested /api/tasks)
                var allTasks = await _taskRepository.GetAllAsync();
                stats.TotalProjects = allTasks.Count();
                stats.CompletedProjects = allTasks.Count(t => t.Status == TaskStatus.Completed);
                stats.ActiveProjects = allTasks.Count(t => t.Status == TaskStatus.Active);
                stats.UpcomingProjects = allTasks.Count(t => t.Status == TaskStatus.Active && t.StartDate > DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                // Continue with default values if tasks fail
                Console.WriteLine($"Tasks error: {ex.Message}");
            }

            try
            {
                // Try to get users - this is likely where the error occurs
                var allUsers = await _userRepository.GetAllAsync();
                stats.TotalVolunteers = allUsers.Count(u => u.Role == UserRole.User);
            }
            catch (Exception ex)
            {
                // Log the specific error and continue with default value
                Console.WriteLine($"Users error: {ex.Message}");
                // Return early with the error for debugging
                return ApiResponseDto<DashboardStatsDto>.ErrorResponse($"Users repository error: {ex.Message}");
            }

            return ApiResponseDto<DashboardStatsDto>.Success(stats);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<DashboardStatsDto>.ErrorResponse($"General error: {ex.Message}");
        }
    }
}
