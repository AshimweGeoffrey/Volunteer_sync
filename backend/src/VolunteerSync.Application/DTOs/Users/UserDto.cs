using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.ValueObjects;

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
    public string? Bio { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }
    public string? Location { get; set; }
    public List<string> Skills { get; set; } = new();
    public List<string> Interests { get; set; } = new();
    public List<string> Availability { get; set; } = new();
    public int CompletedProjects { get; set; }
    public double Rating { get; set; }
    public List<Badge> Badges { get; set; } = new();
    public DateTime? LastLoginAt { get; set; }
}
