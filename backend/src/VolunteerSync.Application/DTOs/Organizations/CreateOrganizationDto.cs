using VolunteerSync.Domain.ValueObjects;

namespace VolunteerSync.Application.DTOs.Organizations;

public class CreateOrganizationDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ContactInfo ContactInfo { get; set; } = new();
    public Address Address { get; set; } = new();
    public string Website { get; set; } = string.Empty;
    public List<string> Categories { get; set; } = new();
}
