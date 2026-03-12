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
}