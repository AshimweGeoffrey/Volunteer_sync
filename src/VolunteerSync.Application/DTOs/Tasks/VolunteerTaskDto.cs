using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.ValueObjects;

namespace VolunteerSync.Application.DTOs.Tasks;

public class VolunteerTaskDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public Address Location { get; set; } = new();
    public int MaxVolunteers { get; set; }
    public int CurrentVolunteers { get; set; }
    public TaskStatus Status { get; set; }
    public TaskCategory Category { get; set; }
    public List<string> Requirements { get; set; } = new();
    public List<string> Skills { get; set; } = new();
    public string OrganizationId { get; set; } = string.Empty;
    public string CreatedById { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public bool IsUrgent { get; set; }
    public DateTime? ApplicationDeadline { get; set; }
    public DateTime CreatedAt { get; set; }
}
