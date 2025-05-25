using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace VolunteerSync.Domain.Entities;

[BsonCollection("notifications")]
public class Notification : BaseEntity
{
    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;
    
    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;
    
    [BsonElement("message")]
    public string Message { get; set; } = string.Empty;
    
    [BsonElement("type")]
    public string Type { get; set; } = string.Empty; // info, success, warning, error, project, application
    
    [BsonElement("isRead")]
    public bool IsRead { get; set; } = false;
    
    [BsonElement("projectId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ProjectId { get; set; }
    
    [BsonElement("actionUrl")]
    public string? ActionUrl { get; set; }
    
    [BsonElement("icon")]
    public string? Icon { get; set; }
}
