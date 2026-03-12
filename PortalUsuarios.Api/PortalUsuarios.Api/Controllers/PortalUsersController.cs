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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _portalAuthService.GetUsersAsync();
            return Ok(users.Select(ToResponse));
        }


        [HttpGet("clients")]
        public async Task<IActionResult> GetClients()
        {
            var users = await _portalAuthService.GetClientUsersAsync();
            return Ok(users.Select(ToResponse));
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

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _portalAuthService.DeleteUserAsync(id);
            if (!result.Success)
            {
                if (result.Error == "Usuario no encontrado.")
                    return NotFound(new { message = result.Error });

                return BadRequest(new { message = result.Error });
            }

            return Ok(new { message = "Usuario eliminado correctamente." });
        }

        [HttpPost("delete-bulk")]
        public async Task<IActionResult> DeleteBulk([FromBody] BulkDeletePortalUsersDto dto)
        {
            var deletedCount = await _portalAuthService.DeleteUsersAsync(dto.UserIds.Distinct().ToList());
            return Ok(new { deletedCount });
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
