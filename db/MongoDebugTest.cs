using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// Simple test entities without complex dependencies
public class SimpleOrganization
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;
    
    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;
    
    [BsonElement("isActive")]
    public bool IsActive { get; set; }
}

class Program
{
    static async Task Main(string[] args)
    {
        try
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("VolunteerSync");
            
            Console.WriteLine("Testing MongoDB connection and data retrieval...");
            
            // Test 1: Get collection stats
            var collection = database.GetCollection<SimpleOrganization>("organizations");
            var count = await collection.CountDocumentsAsync(FilterDefinition<SimpleOrganization>.Empty);
            Console.WriteLine($"Total documents in organizations collection: {count}");
            
            // Test 2: Try to get raw BSON documents
            var rawCollection = database.GetCollection<BsonDocument>("organizations");
            var rawDocs = await rawCollection.Find(FilterDefinition<BsonDocument>.Empty).Limit(2).ToListAsync();
            Console.WriteLine($"Raw documents found: {rawDocs.Count}");
            
            if (rawDocs.Count > 0)
            {
                Console.WriteLine("First raw document:");
                Console.WriteLine(rawDocs[0].ToJson());
            }
            
            // Test 3: Try to deserialize to simple entity
            var orgs = await collection.Find(FilterDefinition<SimpleOrganization>.Empty).Limit(2).ToListAsync();
            Console.WriteLine($"Deserialized organizations: {orgs.Count}");
            
            foreach (var org in orgs)
            {
                Console.WriteLine($"Organization: {org.Name} - {org.Description}");
            }
            
            // Test 4: Test with explicit filter
            var activeFilter = Builders<SimpleOrganization>.Filter.Eq(o => o.IsActive, true);
            var activeOrgs = await collection.Find(activeFilter).ToListAsync();
            Console.WriteLine($"Active organizations: {activeOrgs.Count}");
            
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
}
