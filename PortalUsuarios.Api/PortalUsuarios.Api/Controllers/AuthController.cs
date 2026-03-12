using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalUsuarios.Api.DTOs;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly PortalAuthService _authService;
    private readonly TokenService _tokenService;

    public AuthController(PortalAuthService authService, TokenService tokenService)
    {
        _authService = authService;
        _tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var user = await _authService.ValidateUserAsync(dto.Username, dto.Password);

        if (user == null)
            return Unauthorized(new { message = "Credenciales inválidas." });

        var token = _tokenService.CreateToken(user);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.RoleName
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = _tokenService.GetCurrentUserId(User);
        if (userId == null)
            return Unauthorized(new { message = "Token inválido." });

        var user = await _authService.GetByIdAsync(userId.Value);
        if (user == null)
            return NotFound(new { message = "Usuario no encontrado." });

        return Ok(new CurrentUserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            ExternalApiUsername = user.ExternalApiUsername,
            ExternalApiPassword = user.ExternalApiPassword,
            Email = user.Email,
            FullName = user.FullName,
            RoleName = user.RoleName,
            IsActive = user.IsActive
        });
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateCurrentUserProfileDto dto)
    {
        var userId = _tokenService.GetCurrentUserId(User);
        if (userId == null)
            return Unauthorized(new { message = "Token inválido." });

        var result = await _authService.UpdateCurrentUserAsync(userId.Value, dto);
        if (!result.Success)
        {
            if (result.Error == "Usuario no encontrado.")
                return NotFound(new { message = result.Error });

            return BadRequest(new { message = result.Error });
        }

        var user = result.User!;
        return Ok(new CurrentUserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            ExternalApiUsername = user.ExternalApiUsername,
            ExternalApiPassword = user.ExternalApiPassword,
            Email = user.Email,
            FullName = user.FullName,
            RoleName = user.RoleName,
            IsActive = user.IsActive
        });
    }

    [Authorize]
    [HttpPut("me/change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 6)
            return BadRequest(new { message = "La nueva contraseña debe tener al menos 6 caracteres." });

        var userId = _tokenService.GetCurrentUserId(User);
        if (userId == null)
            return Unauthorized(new { message = "Token inválido." });

        var result = await _authService.ChangePasswordAsync(userId.Value, dto.CurrentPassword, dto.NewPassword);
        if (!result.Success)
        {
            if (result.Error == "Usuario no encontrado.")
                return NotFound(new { message = result.Error });

            return BadRequest(new { message = result.Error });
        }

        return Ok(new { message = "Contraseña actualizada correctamente." });
    }
}
