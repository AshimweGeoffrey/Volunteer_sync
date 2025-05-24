using MongoDB.Driver;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Domain.Interfaces.Services;

namespace VolunteerSync.Infrastructure.Repositories;

public class TaskRegistrationRepository : BaseRepository<TaskRegistration>, ITaskRegistrationRepository
{
    public TaskRegistrationRepository(IMongoContext mongoContext) : base(mongoContext)
    {
    }

    public async Task<IEnumerable<TaskRegistration>> GetByUserIdAsync(string userId)
    {
        var filter = _filterBuilder.Eq(r => r.UserId, userId);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<IEnumerable<TaskRegistration>> GetByTaskIdAsync(string taskId)
    {
        var filter = _filterBuilder.Eq(r => r.VolunteerTaskId, taskId);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<TaskRegistration?> GetByUserAndTaskAsync(string userId, string taskId)
    {
        var filter = _filterBuilder.And(
            _filterBuilder.Eq(r => r.UserId, userId),
            _filterBuilder.Eq(r => r.VolunteerTaskId, taskId)
        );
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<TaskRegistration>> GetByStatusAsync(RegistrationStatus status)
    {
        var filter = _filterBuilder.Eq(r => r.Status, status);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<bool> IsUserRegisteredForTaskAsync(string userId, string taskId)
    {
        var filter = _filterBuilder.And(
            _filterBuilder.Eq(r => r.UserId, userId),
            _filterBuilder.Eq(r => r.VolunteerTaskId, taskId)
        );
        var count = await _collection.CountDocumentsAsync(filter);
        return count > 0;
    }
}
