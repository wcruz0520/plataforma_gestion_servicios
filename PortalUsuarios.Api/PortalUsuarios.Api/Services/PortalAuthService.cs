using Microsoft.EntityFrameworkCore;
using PortalUsuarios.Api.DTOs;
using PortalUsuarios.Api.Models;

public class PortalAuthService
{
    private readonly AppDbContext _dbContext;

    public PortalAuthService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PortalUser?> ValidateUserAsync(string username, string password)
    {
        var user = await _dbContext.PortalUsers
            .FirstOrDefaultAsync(x => x.Username == username && x.IsActive);

        if (user == null)
            return null;

        bool passwordOk = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

        if (!passwordOk)
            return null;

        return user;
    }

    public async Task<PortalUser?> GetByIdAsync(int id)
    {
        return await _dbContext.PortalUsers.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<(bool Success, string? Error, PortalUser? User)> CreateUserAsync(UpsertPortalUserDto dto)
    {
        var exists = await _dbContext.PortalUsers.AnyAsync(x => x.Username == dto.Username);
        if (exists)
            return (false, "El username ya está en uso.", null);

        var user = new PortalUser
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            ExternalApiUsername = dto.ExternalApiUsername,
            ExternalApiPassword = dto.ExternalApiPassword,
            Email = dto.Email,
            FullName = dto.FullName,
            RoleName = dto.RoleName,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.PortalUsers.Add(user);
        await _dbContext.SaveChangesAsync();

        return (true, null, user);
    }

    public async Task<(bool Success, string? Error, PortalUser? User)> UpdateUserAsync(int id, UpsertPortalUserDto dto)
    {
        var user = await _dbContext.PortalUsers.FirstOrDefaultAsync(x => x.Id == id);
        if (user == null)
            return (false, "Usuario no encontrado.", null);

        var usernameInUse = await _dbContext.PortalUsers
            .AnyAsync(x => x.Username == dto.Username && x.Id != id);

        if (usernameInUse)
            return (false, "El username ya está en uso.", null);

        user.Username = dto.Username;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.ExternalApiUsername = dto.ExternalApiUsername;
        user.ExternalApiPassword = dto.ExternalApiPassword;
        user.Email = dto.Email;
        user.FullName = dto.FullName;
        user.RoleName = dto.RoleName;
        user.IsActive = dto.IsActive;

        await _dbContext.SaveChangesAsync();

        return (true, null, user);
    }
}
