using MongoDB.Driver;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Domain.Interfaces.Services;

namespace VolunteerSync.Infrastructure.Repositories;

public class VolunteerTaskRepository : BaseRepository<VolunteerTask>, IVolunteerTaskRepository
{
    public VolunteerTaskRepository(IMongoContext mongoContext) : base(mongoContext)
    {
    }

    public async Task<IEnumerable<VolunteerTask>> GetByOrganizationIdAsync(string organizationId)
    {
        var filter = _filterBuilder.Eq(t => t.OrganizationId, organizationId);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<IEnumerable<VolunteerTask>> GetByCreatedByIdAsync(string createdById)
    {
        var filter = _filterBuilder.Eq(t => t.CreatedById, createdById);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<IEnumerable<VolunteerTask>> GetByCategoryAsync(TaskCategory category)
    {
        var filter = _filterBuilder.Eq(t => t.Category, category);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<IEnumerable<VolunteerTask>> GetFeaturedTasksAsync()
    {
        var filter = _filterBuilder.And(
            _filterBuilder.Eq(t => t.IsUrgent, true),
            _filterBuilder.Eq(t => t.Status, TaskStatus.Active)
        );
        return await _collection.Find(filter)
            .SortByDescending(t => t.CreatedAt)
            .Limit(10)
            .ToListAsync();
    }

    public async Task<IEnumerable<VolunteerTask>> SearchTasksAsync(string searchTerm, int page, int pageSize)
    {
        var filter = _filterBuilder.Or(
            _filterBuilder.Regex(t => t.Title, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            _filterBuilder.Regex(t => t.Description, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            _filterBuilder.AnyIn(t => t.Tags, new[] { searchTerm })
        );

        return await _collection.Find(filter)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<VolunteerTask>> GetTasksNearLocationAsync(double latitude, double longitude, double radiusKm)
    {
        // For simplicity, we'll implement a basic distance calculation
        // In a production environment, you might want to use MongoDB's geospatial queries
        var allTasks = await _collection.Find(_filterBuilder.Empty).ToListAsync();
        
        return allTasks.Where(t => 
            t.Location?.Latitude.HasValue == true && 
            t.Location?.Longitude.HasValue == true &&
            CalculateDistance(latitude, longitude, t.Location.Latitude.Value, t.Location.Longitude.Value) <= radiusKm);
    }

    public async Task<IEnumerable<VolunteerTask>> GetActiveTasksAsync()
    {
        var filter = _filterBuilder.Eq(t => t.Status, TaskStatus.Active);
        return await _collection.Find(filter)
            .SortByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double earthRadius = 6371; // Earth's radius in kilometers
        
        var dLat = DegreesToRadians(lat2 - lat1);
        var dLon = DegreesToRadians(lon2 - lon1);
        
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        
        return earthRadius * c;
    }

    private static double DegreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}
