using Microsoft.EntityFrameworkCore;
using VolunteerSyncAPI.Models;

namespace VolunteerSyncAPI.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
