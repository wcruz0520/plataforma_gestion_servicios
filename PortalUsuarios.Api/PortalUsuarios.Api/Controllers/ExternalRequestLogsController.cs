using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalUsuarios.Api.Models;
using System.Security.Claims;

namespace PortalUsuarios.Api.Controllers
{
    [ApiController]
    [Route("api/external-request-logs")]
    [Authorize]
    public class ExternalRequestLogsController : ControllerBase
    {
        private readonly ExternalApiUserService _service;
        private readonly PortalAuthService _portalAuthService;

        public ExternalRequestLogsController(ExternalApiUserService service, PortalAuthService portalAuthService)
        {
            _service = service;
            _portalAuthService = portalAuthService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRequestLogs()
        {
            var portalUser = await GetCurrentPortalUserAsync();
            var response = await _service.GetRequestLogsAsync(portalUser);
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

            return new ContentResult
            {
                StatusCode = (int)response.StatusCode,
                Content = content,
                ContentType = "application/json"
            };
        }
    }
}
