using VolunteerSync.Domain.Entities;

namespace VolunteerSync.Domain.Interfaces.Repositories;

public interface INotificationRepository : IBaseRepository<Notification>
{
    Task<IEnumerable<Notification>> GetByUserIdAsync(string userId);
    Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(string userId);
    Task<int> GetUnreadCountByUserIdAsync(string userId);
    Task<(IEnumerable<Notification> Items, long TotalCount)> GetPagedByUserIdAsync(string userId, int page, int pageSize, bool? isRead = null);
    Task MarkAsReadAsync(string id);
    Task MarkAllAsReadByUserIdAsync(string userId);
}
