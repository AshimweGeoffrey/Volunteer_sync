using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Enums;

namespace VolunteerSync.Domain.Interfaces.Repositories;

public interface ITaskRegistrationRepository : IBaseRepository<TaskRegistration>
{
    Task<IEnumerable<TaskRegistration>> GetByUserIdAsync(string userId);
    Task<IEnumerable<TaskRegistration>> GetByTaskIdAsync(string taskId);
    Task<TaskRegistration?> GetByUserAndTaskAsync(string userId, string taskId);
    Task<IEnumerable<TaskRegistration>> GetByStatusAsync(RegistrationStatus status);
    Task<bool> IsUserRegisteredForTaskAsync(string userId, string taskId);
}
