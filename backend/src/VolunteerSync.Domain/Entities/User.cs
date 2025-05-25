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
    
    [BsonElement("phone")]
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
    
    [BsonElement("bio")]
    public string? Bio { get; set; }
    
    [BsonElement("age")]
    public int? Age { get; set; }
    
    [BsonElement("gender")]
    public string? Gender { get; set; }
    
    [BsonElement("location")]
    public string? Location { get; set; }
    
    [BsonElement("interests")]
    public List<string> Interests { get; set; } = new();
    
    [BsonElement("completedProjects")]
    public int CompletedProjects { get; set; } = 0;
    
    [BsonElement("rating")]
    public double Rating { get; set; } = 0.0;
    
    [BsonElement("badges")]
    public List<Badge> Badges { get; set; } = new();
    
    [BsonElement("preferences")]
    public Dictionary<string, object> Preferences { get; set; } = new();
    
    [BsonElement("lastLoginAt")]
    public DateTime? LastLoginAt { get; set; }
}
