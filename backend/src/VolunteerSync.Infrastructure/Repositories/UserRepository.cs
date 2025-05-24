using MongoDB.Driver;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Domain.Interfaces.Services;

namespace VolunteerSync.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(IMongoContext mongoContext) : base(mongoContext)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var filter = _filterBuilder.Eq(u => u.Email, email);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<User>> GetByOrganizationIdAsync(string organizationId)
    {
        var filter = _filterBuilder.Eq(u => u.OrganizationId, organizationId);
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        var filter = _filterBuilder.Eq(u => u.Email, email);
        var count = await _collection.CountDocumentsAsync(filter);
        return count > 0;
    }

    public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm, int page, int pageSize)
    {
        var filter = _filterBuilder.Or(
            _filterBuilder.Regex(u => u.FirstName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            _filterBuilder.Regex(u => u.LastName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            _filterBuilder.Regex(u => u.Email, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
        );

        return await _collection.Find(filter)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }
}
