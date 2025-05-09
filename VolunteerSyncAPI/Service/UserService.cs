using Microsoft.Extensions.Options;
using MongoDB.Driver;
using VolunteerSyncAPI.Models;
using VolunteerSyncAPI.Configuration;
using System.Threading.Tasks;

namespace VolunteerSyncAPI.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<MongoDbSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _users = database.GetCollection<User>("Users");
        }

        // Check if user exists by email
        public async Task<bool> UserExistsAsync(string email)
        {
            var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
            return user != null;
        }

        // Register a new user
        public async Task CreateUserAsync(User user)
        {
            await _users.InsertOneAsync(user);
        }

        // Login logic (check if email and password match)
        public async Task<User?> LoginAsync(string email, string password)
        {
            var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

            if (user == null || !VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }

            return user;
        }

        private bool VerifyPasswordHash(string password, string storedHash, string storedSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512(Convert.FromBase64String(storedSalt));
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(computedHash) == storedHash;
        }

        public void CreatePasswordHash(string password, out string hash, out string salt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            salt = Convert.ToBase64String(hmac.Key);
            hash = Convert.ToBase64String(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)));
        }
    }
}
