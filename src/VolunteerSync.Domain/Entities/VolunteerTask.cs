using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.ValueObjects;

namespace VolunteerSync.Domain.Entities;

[BsonCollection("volunteer_tasks")]
public class VolunteerTask : BaseEntity
{
    [BsonElement("title")]
    [BsonRequired]
    public string Title { get; set; } = string.Empty;
    
    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;
    
    [BsonElement("startDate")]
    public DateTime StartDate { get; set; }
    
    [BsonElement("endDate")]
    public DateTime EndDate { get; set; }
    
    [BsonElement("location")]
    public Address Location { get; set; } = new();
    
    [BsonElement("maxVolunteers")]
    public int MaxVolunteers { get; set; }
    
    [BsonElement("currentVolunteers")]
    public int CurrentVolunteers { get; set; } = 0;
    
    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public TaskStatus Status { get; set; } = TaskStatus.Active;
    
    [BsonElement("category")]
    [BsonRepresentation(BsonType.String)]
    public TaskCategory Category { get; set; }
    
    [BsonElement("requirements")]
    public List<string> Requirements { get; set; } = new();
    
    [BsonElement("skills")]
    public List<string> Skills { get; set; } = new();
    
    [BsonElement("organizationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string OrganizationId { get; set; } = string.Empty;
    
    [BsonElement("createdById")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CreatedById { get; set; } = string.Empty;
    
    [BsonElement("imageUrls")]
    public List<string> ImageUrls { get; set; } = new();
    
    [BsonElement("tags")]
    public List<string> Tags { get; set; } = new();
    
    [BsonElement("isUrgent")]
    public bool IsUrgent { get; set; } = false;
    
    [BsonElement("applicationDeadline")]
    public DateTime? ApplicationDeadline { get; set; }
}
