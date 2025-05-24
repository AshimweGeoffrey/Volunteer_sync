using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Users;

namespace VolunteerSync.Application.Services.Interfaces;

public interface IUserService
{
    Task<ApiResponseDto<UserDto>> GetByIdAsync(string id);
    Task<ApiResponseDto<UserDto>> GetByEmailAsync(string email);
    Task<ApiResponseDto<PagedResultDto<UserDto>>> GetAllAsync(int page, int pageSize);
    Task<ApiResponseDto<UserDto>> CreateAsync(CreateUserDto createUserDto);
    Task<ApiResponseDto<UserDto>> UpdateAsync(string id, CreateUserDto updateUserDto);
    Task<ApiResponseDto<bool>> DeleteAsync(string id);
    Task<ApiResponseDto<PagedResultDto<UserDto>>> SearchAsync(string searchTerm, int page, int pageSize);
    Task<ApiResponseDto<IEnumerable<UserDto>>> GetByOrganizationAsync(string organizationId);
}
