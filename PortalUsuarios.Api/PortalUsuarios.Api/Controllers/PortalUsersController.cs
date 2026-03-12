using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalUsuarios.Api.DTOs;
using PortalUsuarios.Api.Models;

namespace PortalUsuarios.Api.Controllers
{
    [ApiController]
    [Route("api/portal-users")]
    [Authorize(Roles = "Admin")]
    public class PortalUsersController : ControllerBase
    {
        private readonly PortalAuthService _portalAuthService;

        public PortalUsersController(PortalAuthService portalAuthService)
        {
            _portalAuthService = portalAuthService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UpsertPortalUserDto dto)
        {
            var result = await _portalAuthService.CreateUserAsync(dto);
            if (!result.Success)
                return BadRequest(new { message = result.Error });

            return Ok(ToResponse(result.User!));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpsertPortalUserDto dto)
        {
            var result = await _portalAuthService.UpdateUserAsync(id, dto);
            if (!result.Success)
            {
                if (result.Error == "Usuario no encontrado.")
                    return NotFound(new { message = result.Error });

                return BadRequest(new { message = result.Error });
            }

            return Ok(ToResponse(result.User!));
        }

        private static PortalUserResponseDto ToResponse(PortalUser user)
        {
            return new PortalUserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                ExternalApiUsername = user.ExternalApiUsername,
                Email = user.Email,
                FullName = user.FullName,
                RoleName = user.RoleName,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
