using VolunteerSync.Domain.ValueObjects;

namespace VolunteerSync.Application.DTOs.Organizations;

public class OrganizationDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ContactInfo ContactInfo { get; set; } = new();
    public Address Address { get; set; } = new();
    public string Website { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public List<string> Categories { get; set; } = new();
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; }
    public int MemberCount { get; set; }
    public int TaskCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
