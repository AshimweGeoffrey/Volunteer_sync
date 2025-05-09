using Microsoft.AspNetCore.Mvc;
using VolunteerSyncAPI.Models;
using VolunteerSyncAPI.Models.DTOs;
using VolunteerSyncAPI.Services;
using System.Threading.Tasks;

namespace VolunteerSyncAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly EmailService _emailService;

        public AuthController(UserService userService, EmailService emailService)
        {
            _userService = userService;
            _emailService = emailService;
        }

        // Register new user
        [HttpPost("signup")]
        public async Task<IActionResult> Register(UserDto request)
        {
            if (await _userService.UserExistsAsync(request.Email))
                return BadRequest("Email already exists.");

            _userService.CreatePasswordHash(request.Password, out string passwordHash, out string passwordSalt);

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                UserName = request.UserName,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Location = request.Location ?? ""
            };

            await _userService.CreateUserAsync(user);

            // Send welcome email
            string subject = "Welcome to VolunteerSync!";
            string body = $@"
                <h3>Hello {user.FirstName},</h3>
                <p>Thank you for registering with VolunteerSync.</p>
                <p>We’re excited to have you on board!</p>";

            await _emailService.SendEmailAsync(user.Email, subject, body);

            return Ok("User registered successfully and confirmation email sent.");
        }

        // Login user
        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthDto request)
        {
            var user = await _userService.LoginAsync(request.Email, request.Password);

            if (user == null)
                return Unauthorized("Invalid credentials.");

            return Ok("Login successful.");
        }
    }
}
