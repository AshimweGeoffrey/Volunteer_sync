using System.ComponentModel.DataAnnotations;

namespace VolunteerSyncAPI.Models.DTOs
{
    public class AuthDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public required string Password { get; set; }
    }

    public class UserDto : AuthDto
    {
        [Required]
        [StringLength(50)]
        public required string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public required string LastName { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 3)]
        public required string UserName { get; set; }

        public string? Location { get; set; }
    }
}
