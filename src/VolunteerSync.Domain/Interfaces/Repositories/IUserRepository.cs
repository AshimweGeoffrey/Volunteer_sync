using VolunteerSync.Domain.Entities;

namespace VolunteerSync.Domain.Interfaces.Repositories;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetByOrganizationIdAsync(string organizationId);
    Task<bool> EmailExistsAsync(string email);
    Task<IEnumerable<User>> SearchUsersAsync(string searchTerm, int page, int pageSize);
}
