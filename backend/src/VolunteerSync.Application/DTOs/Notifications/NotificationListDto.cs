namespace VolunteerSync.Application.DTOs.Notifications;

public class NotificationListDto
{
    public List<NotificationDto> Items { get; set; } = new();
    public int UnreadCount { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
