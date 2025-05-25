using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Notifications;

namespace VolunteerSync.Application.Services.Interfaces;

public interface INotificationService
{
    Task<ApiResponseDto<NotificationListDto>> GetByUserIdAsync(string userId, int page, int pageSize, bool? isRead = null);
    Task<ApiResponseDto<NotificationDto>> CreateAsync(CreateNotificationDto createNotificationDto);
    Task<ApiResponseDto<bool>> MarkAsReadAsync(string id, string userId);
    Task<ApiResponseDto<bool>> MarkAllAsReadAsync(string userId);
    Task<ApiResponseDto<int>> GetUnreadCountAsync(string userId);
}
