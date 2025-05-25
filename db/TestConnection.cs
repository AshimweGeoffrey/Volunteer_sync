using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Threading.Tasks;

// Simple test to verify MongoDB connection and data retrieval
public class TestOrganization
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;
    
    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;
    
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }
}

class Program
{
    static async Task Main(string[] args)
    {
        try
        {
            Console.WriteLine("🔗 Testing MongoDB connection...");
            
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("VolunteerSync");
            var collection = database.GetCollection<TestOrganization>("organizations");
            
            // Test count
            var count = await collection.CountDocumentsAsync(FilterDefinition<TestOrganization>.Empty);
            Console.WriteLine($"📊 Total organizations in database: {count}");
            
            // Test retrieval
            var organizations = await collection.Find(FilterDefinition<TestOrganization>.Empty).ToListAsync();
            Console.WriteLine($"📋 Retrieved organizations: {organizations.Count}");
            
            foreach (var org in organizations)
            {
                Console.WriteLine($"  - ID: {org.Id}, Name: {org.Name}");
            }
            
            Console.WriteLine("✅ Connection test completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
}
