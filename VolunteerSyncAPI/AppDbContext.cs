using MongoDB.Driver;
using VolunteerSyncAPI.Models;

namespace VolunteerSyncAPI.Data
{
    public class AppDbContext
    {
        private readonly IMongoDatabase _database;

        public AppDbContext(IMongoClient mongoClient, string databaseName)
        {
            _database = mongoClient.GetDatabase(databaseName);
        }

        // MongoDB collections
        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");

        // Add more collections for other models as needed
    }
}
