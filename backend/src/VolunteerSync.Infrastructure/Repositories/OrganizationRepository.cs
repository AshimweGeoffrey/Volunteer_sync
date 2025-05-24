using MongoDB.Driver;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Domain.Interfaces.Services;

namespace VolunteerSync.Infrastructure.Repositories;

public class OrganizationRepository : BaseRepository<Organization>, IOrganizationRepository
{
    public OrganizationRepository(IMongoContext mongoContext) : base(mongoContext)
    {
    }

    public async Task<IEnumerable<Organization>> GetVerifiedOrganizationsAsync()
    {
        var filter = _filterBuilder.And(
            _filterBuilder.Eq(o => o.IsVerified, true),
            _filterBuilder.Eq(o => o.IsActive, true)
        );
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<IEnumerable<Organization>> SearchOrganizationsAsync(string searchTerm, int page, int pageSize)
    {
        var filter = _filterBuilder.Or(
            _filterBuilder.Regex(o => o.Name, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            _filterBuilder.Regex(o => o.Description, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
        );

        return await _collection.Find(filter)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Organization>> GetByCategoriesAsync(List<string> categories)
    {
        var filter = _filterBuilder.AnyIn(o => o.Categories, categories);
        return await _collection.Find(filter).ToListAsync();
    }
}
