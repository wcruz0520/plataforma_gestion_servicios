using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalUsuarios.Api.DTOs;

namespace PortalUsuarios.Api.Controllers
{
    [ApiController]
    [Route("api/external-users")]
    [Authorize(Roles = "Admin")]
    public class ExternalUsersController : ControllerBase
    {
        private readonly ExternalApiUserService _service;

        public ExternalUsersController(ExternalApiUserService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateExternalUserDto dto)
        {
            var response = await _service.CreateUserAsync(dto);

            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, content);
            }

            return Ok(content);
        }
    }
}
