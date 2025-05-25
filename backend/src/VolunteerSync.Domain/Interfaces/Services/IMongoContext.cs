using MongoDB.Driver;

namespace VolunteerSync.Domain.Interfaces.Services;

public interface IMongoContext
{
    IMongoDatabase Database { get; }
    IMongoCollection<T> GetCollection<T>(string? name = null);
}
