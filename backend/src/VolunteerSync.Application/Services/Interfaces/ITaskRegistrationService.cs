using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Registrations;
using VolunteerSync.Domain.Enums;

namespace VolunteerSync.Application.Services.Interfaces;

public interface ITaskRegistrationService
{
    Task<ApiResponseDto<TaskRegistrationDto>> GetByIdAsync(string id);
    Task<ApiResponseDto<PagedResultDto<TaskRegistrationDto>>> GetAllAsync(int page, int pageSize);
    Task<ApiResponseDto<IEnumerable<TaskRegistrationDto>>> GetByTaskIdAsync(string taskId);
    Task<ApiResponseDto<IEnumerable<TaskRegistrationDto>>> GetByUserIdAsync(string userId);
    Task<ApiResponseDto<TaskRegistrationDto>> CreateAsync(CreateTaskRegistrationDto createDto);
    Task<ApiResponseDto<TaskRegistrationDto>> UpdateStatusAsync(string id, RegistrationStatus status);
    Task<ApiResponseDto<bool>> DeleteAsync(string id);
    Task<ApiResponseDto<bool>> ApproveRegistrationAsync(string id);
    Task<ApiResponseDto<bool>> RejectRegistrationAsync(string id, string reason);
    Task<ApiResponseDto<IEnumerable<TaskRegistrationDto>>> GetPendingRegistrationsAsync(string organizationId);
}
