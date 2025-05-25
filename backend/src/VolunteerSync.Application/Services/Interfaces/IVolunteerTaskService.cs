using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Tasks;
using VolunteerSync.Domain.Enums;
using TaskStatus = VolunteerSync.Domain.Enums.TaskStatus;

namespace VolunteerSync.Application.Services.Interfaces;

public interface IVolunteerTaskService
{
    Task<ApiResponseDto<VolunteerTaskDto>> GetByIdAsync(string id);
    Task<ApiResponseDto<PagedResultDto<VolunteerTaskDto>>> GetAllAsync(int page, int pageSize, TaskStatus? status = null, TaskCategory? category = null, string? search = null, string? organizationId = null);
    Task<ApiResponseDto<VolunteerTaskDto>> CreateAsync(CreateVolunteerTaskDto createTaskDto, string userId);
    Task<ApiResponseDto<VolunteerTaskDto>> UpdateAsync(string id, CreateVolunteerTaskDto updateTaskDto);
    Task<ApiResponseDto<bool>> DeleteAsync(string id);
    Task<ApiResponseDto<PagedResultDto<VolunteerTaskDto>>> SearchAsync(string searchTerm, int page, int pageSize);
    Task<ApiResponseDto<IEnumerable<VolunteerTaskDto>>> GetByOrganizationAsync(string organizationId);
    Task<ApiResponseDto<IEnumerable<VolunteerTaskDto>>> GetByCreatedByAsync(string userId);
    Task<ApiResponseDto<IEnumerable<VolunteerTaskDto>>> GetByCategoryAsync(TaskCategory category);
    Task<ApiResponseDto<IEnumerable<VolunteerTaskDto>>> GetFeaturedAsync();
    Task<ApiResponseDto<bool>> RegisterForTaskAsync(string taskId, string userId, string applicationMessage);
    Task<ApiResponseDto<bool>> UnregisterFromTaskAsync(string taskId, string userId);
}
