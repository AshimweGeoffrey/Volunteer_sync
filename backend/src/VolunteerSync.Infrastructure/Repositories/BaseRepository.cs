using MongoDB.Driver;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Domain.Interfaces.Services;

namespace VolunteerSync.Infrastructure.Repositories;

public abstract class BaseRepository<T> : IBaseRepository<T> where T : BaseEntity
{
    protected readonly IMongoCollection<T> _collection;
    protected readonly FilterDefinitionBuilder<T> _filterBuilder = Builders<T>.Filter;

    protected BaseRepository(IMongoContext mongoContext)
    {
        _collection = mongoContext.GetCollection<T>();
    }

    public async Task<T?> GetByIdAsync(string id)
    {
        var filter = _filterBuilder.Eq(entity => entity.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _collection.Find(_filterBuilder.Empty).ToListAsync();
    }

    public async Task<T> CreateAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _collection.InsertOneAsync(entity);
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        var filter = _filterBuilder.Eq(existingEntity => existingEntity.Id, entity.Id);
        await _collection.ReplaceOneAsync(filter, entity);
    }

    public async Task DeleteAsync(string id)
    {
        var filter = _filterBuilder.Eq(entity => entity.Id, id);
        await _collection.DeleteOneAsync(filter);
    }

    public async Task<long> CountAsync(FilterDefinition<T>? filter = null)
    {
        return await _collection.CountDocumentsAsync(filter ?? _filterBuilder.Empty);
    }

    public async Task<IEnumerable<T>> FindAsync(FilterDefinition<T> filter)
    {
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<(IEnumerable<T> Items, long TotalCount)> GetPagedAsync(
        FilterDefinition<T> filter, int page, int pageSize, SortDefinition<T>? sort = null)
    {
        var totalCount = await _collection.CountDocumentsAsync(filter);
        var query = _collection.Find(filter);
        
        if (sort != null)
            query = query.Sort(sort);
            
        var items = await query
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
