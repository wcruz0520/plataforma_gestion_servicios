using Microsoft.EntityFrameworkCore;
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
}