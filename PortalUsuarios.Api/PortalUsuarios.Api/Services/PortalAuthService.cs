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

    public async Task<(bool Success, string? Error, PortalUser? User)> UpdateCurrentUserAsync(int id, UpdateCurrentUserProfileDto dto)
    {
        var user = await _dbContext.PortalUsers.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
        if (user == null)
            return (false, "Usuario no encontrado.", null);

        var usernameInUse = await _dbContext.PortalUsers
            .AnyAsync(x => x.Username == dto.Username && x.Id != id);

        if (usernameInUse)
            return (false, "El username ya está en uso.", null);

        user.Username = dto.Username;
        user.ExternalApiUsername = dto.ExternalApiUsername;
        user.ExternalApiPassword = dto.ExternalApiPassword;
        user.Email = dto.Email;
        user.FullName = dto.FullName;

        await _dbContext.SaveChangesAsync();

        return (true, null, user);
    }

    public async Task<(bool Success, string? Error)> ChangePasswordAsync(int id, string currentPassword, string newPassword)
    {
        var user = await _dbContext.PortalUsers.FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
        if (user == null)
            return (false, "Usuario no encontrado.");

        var passwordOk = BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash);
        if (!passwordOk)
            return (false, "La contraseña actual es inválida.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _dbContext.SaveChangesAsync();

        return (true, null);
    }

    public async Task<List<PortalUser>> GetClientUsersAsync()
    {
        return await _dbContext.PortalUsers
            .Where(x => x.RoleName == "Cliente")
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<(bool Success, string? Error)> DeleteUserAsync(int id)
    {
        var user = await _dbContext.PortalUsers.FirstOrDefaultAsync(x => x.Id == id);
        if (user == null)
            return (false, "Usuario no encontrado.");

        _dbContext.PortalUsers.Remove(user);
        await _dbContext.SaveChangesAsync();

        return (true, null);
    }

    public async Task<int> DeleteUsersAsync(List<int> userIds)
    {
        if (userIds.Count == 0)
            return 0;

        var users = await _dbContext.PortalUsers
            .Where(x => userIds.Contains(x.Id))
            .ToListAsync();

        if (users.Count == 0)
            return 0;

        _dbContext.PortalUsers.RemoveRange(users);
        await _dbContext.SaveChangesAsync();

        return users.Count;
    }
}
