using MongoDB.Bson.Serialization.Attributes;

namespace VolunteerSync.Domain.ValueObjects;

public class Address
{
    [BsonElement("street")]
    public string Street { get; set; } = string.Empty;
    
    [BsonElement("city")]
    public string City { get; set; } = string.Empty;
    
    [BsonElement("state")]
    public string State { get; set; } = string.Empty;
    
    [BsonElement("zipCode")]
    public string ZipCode { get; set; } = string.Empty;
    
    [BsonElement("country")]
    public string Country { get; set; } = string.Empty;
    
    [BsonElement("latitude")]
    public double? Latitude { get; set; }
    
    [BsonElement("longitude")]
    public double? Longitude { get; set; }
}
