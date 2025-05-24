using MongoDB.Bson.Serialization.Attributes;

namespace VolunteerSync.Domain.ValueObjects;

public class ContactInfo
{
    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;
    
    [BsonElement("phone")]
    public string Phone { get; set; } = string.Empty;
    
    [BsonElement("website")]
    public string Website { get; set; } = string.Empty;
    
    [BsonElement("socialMedia")]
    public Dictionary<string, string> SocialMedia { get; set; } = new();
}
