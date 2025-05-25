using AutoMapper;
using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Notifications;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Repositories;

namespace VolunteerSync.Application.Services.Implementations;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IMapper _mapper;

    public NotificationService(INotificationRepository notificationRepository, IMapper mapper)
    {
        _notificationRepository = notificationRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponseDto<NotificationListDto>> GetByUserIdAsync(string userId, int page, int pageSize, bool? isRead = null)
    {
        try
        {
            var (items, totalCount) = await _notificationRepository.GetPagedByUserIdAsync(userId, page, pageSize, isRead);
            var unreadCount = await _notificationRepository.GetUnreadCountByUserIdAsync(userId);
            
            var notificationDtos = _mapper.Map<List<NotificationDto>>(items);
            
            var result = new NotificationListDto
            {
                Items = notificationDtos,
                UnreadCount = unreadCount,
                TotalCount = (int)totalCount,
                Page = page,
                PageSize = pageSize
            };

            return ApiResponseDto<NotificationListDto>.Success(result);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<NotificationListDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<NotificationDto>> CreateAsync(CreateNotificationDto createNotificationDto)
    {
        try
        {
            var notification = _mapper.Map<Notification>(createNotificationDto);
            notification.CreatedAt = DateTime.UtcNow;
            notification.UpdatedAt = DateTime.UtcNow;
            
            var createdNotification = await _notificationRepository.CreateAsync(notification);
            var notificationDto = _mapper.Map<NotificationDto>(createdNotification);
            
            return ApiResponseDto<NotificationDto>.Success(notificationDto, "Notification created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<NotificationDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<bool>> MarkAsReadAsync(string id, string userId)
    {
        try
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification == null)
            {
                return ApiResponseDto<bool>.ErrorResponse("Notification not found");
            }

            if (notification.UserId != userId)
            {
                return ApiResponseDto<bool>.ErrorResponse("Access denied");
            }

            await _notificationRepository.MarkAsReadAsync(id);
            return ApiResponseDto<bool>.Success(true, "Notification marked as read");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<bool>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<bool>> MarkAllAsReadAsync(string userId)
    {
        try
        {
            await _notificationRepository.MarkAllAsReadByUserIdAsync(userId);
            return ApiResponseDto<bool>.Success(true, "All notifications marked as read");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<bool>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<int>> GetUnreadCountAsync(string userId)
    {
        try
        {
            var count = await _notificationRepository.GetUnreadCountByUserIdAsync(userId);
            return ApiResponseDto<int>.Success(count);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<int>.ErrorResponse(ex.Message);
        }
    }
}
