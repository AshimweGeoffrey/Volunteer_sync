using MongoDB.Driver;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Domain.Interfaces.Services;

namespace VolunteerSync.Infrastructure.Repositories;

public class NotificationRepository : BaseRepository<Notification>, INotificationRepository
{
    public NotificationRepository(IMongoContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(string userId)
    {
        var filter = _filterBuilder.Eq(n => n.UserId, userId);
        return await _collection.Find(filter)
            .SortByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(string userId)
    {
        var filter = _filterBuilder.And(
            _filterBuilder.Eq(n => n.UserId, userId),
            _filterBuilder.Eq(n => n.IsRead, false)
        );
        return await _collection.Find(filter)
            .SortByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountByUserIdAsync(string userId)
    {
        var filter = _filterBuilder.And(
            _filterBuilder.Eq(n => n.UserId, userId),
            _filterBuilder.Eq(n => n.IsRead, false)
        );
        return (int)await _collection.CountDocumentsAsync(filter);
    }

    public async Task<(IEnumerable<Notification> Items, long TotalCount)> GetPagedByUserIdAsync(string userId, int page, int pageSize, bool? isRead = null)
    {
        var filterBuilder = Builders<Notification>.Filter;
        var filter = filterBuilder.Eq(n => n.UserId, userId);
        
        if (isRead.HasValue)
        {
            filter = filterBuilder.And(filter, filterBuilder.Eq(n => n.IsRead, isRead.Value));
        }

        var totalCount = await _collection.CountDocumentsAsync(filter);
        var items = await _collection.Find(filter)
            .SortByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task MarkAsReadAsync(string id)
    {
        var filter = _filterBuilder.Eq(n => n.Id, id);
        var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
        await _collection.UpdateOneAsync(filter, update);
    }

    public async Task MarkAllAsReadByUserIdAsync(string userId)
    {
        var filter = _filterBuilder.And(
            _filterBuilder.Eq(n => n.UserId, userId),
            _filterBuilder.Eq(n => n.IsRead, false)
        );
        var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
        await _collection.UpdateManyAsync(filter, update);
    }
}
