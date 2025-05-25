namespace VolunteerSync.Application.DTOs.Notifications;

public class CreateNotificationDto
{
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? ProjectId { get; set; }
    public string? ActionUrl { get; set; }
    public string? Icon { get; set; }
}
