namespace VolunteerSync.Application.DTOs.Stats;

public class DashboardStatsDto
{
    public int TotalProjects { get; set; }
    public int TotalVolunteers { get; set; }
    public int TotalOrganizations { get; set; }
    public int CompletedProjects { get; set; }
    public int ActiveProjects { get; set; }
    public int UpcomingProjects { get; set; }
}
