using VolunteerSync.Domain.Enums;

namespace VolunteerSync.Application.DTOs.Users;

public class CreateUserDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public string? OrganizationId { get; set; }
    public string? Bio { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }
    public string? Location { get; set; }
    public List<string> Skills { get; set; } = new();
    public List<string> Interests { get; set; } = new();
    public List<string> Availability { get; set; } = new();
}
