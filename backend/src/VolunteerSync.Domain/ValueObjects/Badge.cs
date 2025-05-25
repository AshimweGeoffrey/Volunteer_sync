using MongoDB.Bson.Serialization.Attributes;

namespace VolunteerSync.Domain.ValueObjects;

public class Badge
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;
    
    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;
    
    [BsonElement("iconUrl")]
    public string? IconUrl { get; set; }
    
    [BsonElement("earnedAt")]
    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
    
    [BsonElement("level")]
    public string Level { get; set; } = string.Empty; // Bronze, Silver, Gold, etc.
}
