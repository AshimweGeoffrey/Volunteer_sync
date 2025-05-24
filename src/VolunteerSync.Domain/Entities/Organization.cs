using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using VolunteerSync.Domain.ValueObjects;

namespace VolunteerSync.Domain.Entities;

[BsonCollection("organizations")]
public class Organization : BaseEntity
{
    [BsonElement("name")]
    [BsonRequired]
    public string Name { get; set; } = string.Empty;
    
    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;
    
    [BsonElement("contactInfo")]
    public ContactInfo ContactInfo { get; set; } = new();
    
    [BsonElement("address")]
    public Address Address { get; set; } = new();
    
    [BsonElement("website")]
    public string Website { get; set; } = string.Empty;
    
    [BsonElement("logoUrl")]
    public string LogoUrl { get; set; } = string.Empty;
    
    [BsonElement("categories")]
    public List<string> Categories { get; set; } = new();
    
    [BsonElement("isVerified")]
    public bool IsVerified { get; set; } = false;
    
    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;
    
    [BsonElement("memberCount")]
    public int MemberCount { get; set; } = 0;
    
    [BsonElement("taskCount")]
    public int TaskCount { get; set; } = 0;
}
