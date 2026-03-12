using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalUsuarios.Api.DTOs;
using System.Security.Claims;

namespace PortalUsuarios.Api.Controllers
{
    [ApiController]
    [Route("api/external-users")]
    [Authorize(Roles = "Admin")]
    public class ExternalUsersController : ControllerBase
    {
        private readonly ExternalApiUserService _service;
        private readonly PortalAuthService _portalAuthService;

        public ExternalUsersController(ExternalApiUserService service, PortalAuthService portalAuthService)
        {
            _service = service;
            _portalAuthService = portalAuthService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateExternalUserDto dto)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            PortalUsuarios.Api.Models.PortalUser? portalUser = null;

            if (int.TryParse(userIdClaim, out var userId))
            {
                portalUser = await _portalAuthService.GetByIdAsync(userId);
            }

            var response = await _service.CreateUserAsync(dto, portalUser);

            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, content);
            }

            return Ok(content);
        }
    }
}
