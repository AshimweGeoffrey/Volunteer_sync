using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using VolunteerSync.Domain.Enums;

namespace VolunteerSync.Domain.Entities;

[BsonCollection("task_registrations")]
public class TaskRegistration : BaseEntity
{
    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;
    
    [BsonElement("volunteerTaskId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string VolunteerTaskId { get; set; } = string.Empty;
    
    [BsonElement("registrationDate")]
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    
    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;
    
    [BsonElement("notes")]
    public string Notes { get; set; } = string.Empty;
    
    [BsonElement("applicationMessage")]
    public string ApplicationMessage { get; set; } = string.Empty;
    
    [BsonElement("reviewedById")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ReviewedById { get; set; }
    
    [BsonElement("reviewedAt")]
    public DateTime? ReviewedAt { get; set; }
    
    [BsonElement("completedAt")]
    public DateTime? CompletedAt { get; set; }
    
    [BsonElement("rating")]
    public int? Rating { get; set; }
    
    [BsonElement("feedback")]
    public string? Feedback { get; set; }
}
