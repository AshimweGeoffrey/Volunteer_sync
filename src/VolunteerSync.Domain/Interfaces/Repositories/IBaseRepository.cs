using MongoDB.Driver;
using VolunteerSync.Domain.Entities;

namespace VolunteerSync.Domain.Interfaces.Repositories;

public interface IBaseRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(string id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> CreateAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(string id);
    Task<long> CountAsync(FilterDefinition<T>? filter = null);
    Task<IEnumerable<T>> FindAsync(FilterDefinition<T> filter);
    Task<(IEnumerable<T> Items, long TotalCount)> GetPagedAsync(
        FilterDefinition<T> filter, int page, int pageSize, SortDefinition<T>? sort = null);
}
