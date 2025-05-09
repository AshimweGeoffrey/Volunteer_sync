using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace VolunteerSyncAPI.Models
{
    public class User
    {
        [BsonId]  // MongoDB automatically handles this ID
        public ObjectId Id { get; set; }  // MongoDB's default ID field is of type ObjectId

        [BsonElement("firstName")]  // MongoDB maps the C# property to the document field
        public required string FirstName { get; set; }

        [BsonElement("lastName")]
        public required string LastName { get; set; }

        [BsonElement("email")]
        public required string Email { get; set; }

        [BsonElement("userName")]
        public required string UserName { get; set; }

        [BsonElement("passwordHash")]
        public required string PasswordHash { get; set; }

        [BsonElement("passwordSalt")]
        public required string PasswordSalt { get; set; }

        [BsonElement("location")]
        public required string Location { get; set; }
    }
}
