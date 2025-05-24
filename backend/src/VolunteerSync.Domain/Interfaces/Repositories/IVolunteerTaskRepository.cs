using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Enums;

namespace VolunteerSync.Domain.Interfaces.Repositories;

public interface IVolunteerTaskRepository : IBaseRepository<VolunteerTask>
{
    Task<IEnumerable<VolunteerTask>> GetByOrganizationIdAsync(string organizationId);
    Task<IEnumerable<VolunteerTask>> GetByCreatedByIdAsync(string createdById);
    Task<IEnumerable<VolunteerTask>> GetByCategoryAsync(TaskCategory category);
    Task<IEnumerable<VolunteerTask>> GetFeaturedTasksAsync();
    Task<IEnumerable<VolunteerTask>> SearchTasksAsync(string searchTerm, int page, int pageSize);
    Task<IEnumerable<VolunteerTask>> GetTasksNearLocationAsync(double latitude, double longitude, double radiusKm);
    Task<IEnumerable<VolunteerTask>> GetActiveTasksAsync();
}
