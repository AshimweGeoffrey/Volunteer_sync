using VolunteerSync.Domain.Entities;

namespace VolunteerSync.Domain.Interfaces.Repositories;

public interface IOrganizationRepository : IBaseRepository<Organization>
{
    Task<IEnumerable<Organization>> GetVerifiedOrganizationsAsync();
    Task<IEnumerable<Organization>> SearchOrganizationsAsync(string searchTerm, int page, int pageSize);
    Task<IEnumerable<Organization>> GetByCategoriesAsync(List<string> categories);
}
