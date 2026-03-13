using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalUsuarios.Api.DTOs;
using PortalUsuarios.Api.Models;
using System.Security.Claims;

namespace PortalUsuarios.Api.Controllers
{
    [ApiController]
    [Route("api/external-users")]
    [Authorize(Roles = "Admin,Desarrollador")]
    public class ExternalUsersController : ControllerBase
    {
        private readonly ExternalApiUserService _service;
        private readonly PortalAuthService _portalAuthService;

        public ExternalUsersController(ExternalApiUserService service, PortalAuthService portalAuthService)
        {
            _service = service;
            _portalAuthService = portalAuthService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var portalUser = await GetCurrentPortalUserAsync();
            var response = await _service.GetUsersAsync(portalUser);
            return await ToProxyResponseAsync(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateExternalUserDto dto)
        {
            var portalUser = await GetCurrentPortalUserAsync();
            var response = await _service.CreateUserAsync(dto, portalUser);
            return await ToProxyResponseAsync(response);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateExternalUserDto dto)
        {
            var portalUser = await GetCurrentPortalUserAsync();
            var response = await _service.UpdateUserAsync(id, dto, portalUser);
            return await ToProxyResponseAsync(response);
        }

        [HttpPut("{id:int}/data_factura")]
        public async Task<IActionResult> UpdateBillingData(int id, UpdateExternalUserBillingDto dto)
        {
            var portalUser = await GetCurrentPortalUserAsync();
            var response = await _service.UpdateBillingDataAsync(id, dto, portalUser);
            return await ToProxyResponseAsync(response);
        }

        private async Task<PortalUser?> GetCurrentPortalUserAsync()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (int.TryParse(userIdClaim, out var userId))
            {
                return await _portalAuthService.GetByIdAsync(userId);
            }

            return null;
        }

        private static async Task<IActionResult> ToProxyResponseAsync(HttpResponseMessage response)
        {
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return new ContentResult
                {
                    StatusCode = (int)response.StatusCode,
                    Content = content,
                    ContentType = "application/json"
                };
            }

            return new ContentResult
            {
                StatusCode = (int)response.StatusCode,
                Content = content,
                ContentType = "application/json"
            };
        }

    }
}
