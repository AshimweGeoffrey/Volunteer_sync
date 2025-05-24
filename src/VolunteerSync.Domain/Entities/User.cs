using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.ValueObjects;

namespace VolunteerSync.Domain.Entities;

[BsonCollection("users")]
public class User : BaseEntity
{
    [BsonElement("firstName")]
    public string FirstName { get; set; } = string.Empty;
    
    [BsonElement("lastName")]
    public string LastName { get; set; } = string.Empty;
    
    [BsonElement("email")]
    [BsonRequired]
    public string Email { get; set; } = string.Empty;
    
    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; } = string.Empty;
    
    [BsonElement("phoneNumber")]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [BsonElement("role")]
    [BsonRepresentation(BsonType.String)]
    public UserRole Role { get; set; }
    
    [BsonElement("dateJoined")]
    public DateTime DateJoined { get; set; } = DateTime.UtcNow;
    
    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;
    
    [BsonElement("organizationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? OrganizationId { get; set; }
    
    [BsonElement("profileImageUrl")]
    public string? ProfileImageUrl { get; set; }
    
    [BsonElement("skills")]
    public List<string> Skills { get; set; } = new();
    
    [BsonElement("availability")]
    public List<string> Availability { get; set; } = new();
    
    [BsonElement("lastLoginAt")]
    public DateTime? LastLoginAt { get; set; }
}
