using VolunteerSync.Domain.Enums;

namespace VolunteerSync.Application.DTOs.Users;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime DateJoined { get; set; }
    public bool IsActive { get; set; }
    public string? OrganizationId { get; set; }
    public string? ProfileImageUrl { get; set; }
    public List<string> Skills { get; set; } = new();
    public List<string> Availability { get; set; } = new();
    public DateTime? LastLoginAt { get; set; }
}
