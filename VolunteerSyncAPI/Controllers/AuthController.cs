using Microsoft.AspNetCore.Mvc;
using VolunteerSyncAPI.Data;

namespace VolunteerSyncAPI.Controllers
{
    public class AuthController : ControllerBase
    { private readonly AppDbContext _context;
        public AuthController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("signup")]
        public async Task<IActionResult> Signup(User user)
        {
            if (await _context.Users.AnyAsync)
        }
    }
    {
    }
}
