using VolunteerSync.Application.DTOs.Users;

namespace VolunteerSync.Application.DTOs.Auth;

public class TokenResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
    public int ExpiresIn { get; set; } // seconds
}
