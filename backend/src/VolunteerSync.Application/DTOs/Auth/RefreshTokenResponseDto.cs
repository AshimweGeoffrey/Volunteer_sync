namespace VolunteerSync.Application.DTOs.Auth;

public class RefreshTokenResponseDto
{
    public string Token { get; set; } = string.Empty;
    public int ExpiresIn { get; set; } // seconds
}
