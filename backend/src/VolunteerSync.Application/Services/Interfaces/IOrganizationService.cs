using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Organizations;

namespace VolunteerSync.Application.Services.Interfaces;

public interface IOrganizationService
{
    Task<ApiResponseDto<OrganizationDto>> GetByIdAsync(string id);
    Task<ApiResponseDto<PagedResultDto<OrganizationDto>>> GetAllAsync(int page, int pageSize);
    Task<ApiResponseDto<OrganizationDto>> CreateAsync(CreateOrganizationDto createOrganizationDto);
    Task<ApiResponseDto<OrganizationDto>> UpdateAsync(string id, CreateOrganizationDto updateOrganizationDto);
    Task<ApiResponseDto<bool>> DeleteAsync(string id);
    Task<ApiResponseDto<PagedResultDto<OrganizationDto>>> SearchAsync(string searchTerm, int page, int pageSize);
    Task<ApiResponseDto<IEnumerable<OrganizationDto>>> GetVerifiedAsync();
    Task<ApiResponseDto<bool>> VerifyAsync(string id);
}
