using System.ComponentModel.DataAnnotations;

namespace VolunteerSync.Application.DTOs.Registrations;

public class CreateTaskRegistrationDto
{
    [Required(ErrorMessage = "Task ID is required")]
    public string TaskId { get; set; } = string.Empty;

    [Required(ErrorMessage = "User ID is required")]
    public string UserId { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Application message cannot exceed 1000 characters")]
    public string ApplicationMessage { get; set; } = string.Empty;
}
