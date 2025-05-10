﻿using Microsoft.AspNetCore.Mvc;

namespace VolunteerSyncAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API is working");
        }
    }
}
