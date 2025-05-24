using VolunteerSync.Domain.Enums;

namespace VolunteerSync.Application.DTOs.Registrations;

public class TaskRegistrationDto
{
    public string Id { get; set; } = string.Empty;
    public string TaskId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string ApplicationMessage { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public RegistrationStatus Status { get; set; }
    
    // Navigation properties for display
    public string? TaskTitle { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
}
