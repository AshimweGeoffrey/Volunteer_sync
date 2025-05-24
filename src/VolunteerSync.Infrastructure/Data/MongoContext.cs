using Microsoft.Extensions.Options;
using MongoDB.Driver;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Services;

namespace VolunteerSync.Infrastructure.Data;

public class MongoContext : IMongoContext
{
    private readonly IMongoDatabase _database;

    public MongoContext(IOptions<DatabaseSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoDatabase Database => _database;

    public IMongoCollection<T> GetCollection<T>(string? name = null)
    {
        var collectionName = name ?? GetCollectionName<T>();
        return _database.GetCollection<T>(collectionName);
    }

    private static string GetCollectionName<T>()
    {
        var attribute = (BsonCollectionAttribute?)Attribute.GetCustomAttribute(typeof(T), typeof(BsonCollectionAttribute));
        return attribute?.CollectionName ?? typeof(T).Name.ToLowerInvariant();
    }
}
