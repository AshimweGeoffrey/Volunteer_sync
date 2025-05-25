using VolunteerSync.Application.DTOs.Auth;
using VolunteerSync.Application.DTOs.Common;

namespace VolunteerSync.Application.Services.Interfaces;

public interface IAuthService
{
    Task<ApiResponseDto<TokenResponseDto>> LoginAsync(LoginRequestDto loginRequest);
    Task<ApiResponseDto<TokenResponseDto>> RegisterAsync(RegisterRequestDto registerRequest);
    Task<ApiResponseDto<RefreshTokenResponseDto>> RefreshTokenAsync(string refreshToken);
    Task<ApiResponseDto<bool>> LogoutAsync(string userId);
}
