namespace PortalUsuarios.Api.DTOs
{
    public class CurrentUserProfileDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? ExternalApiUsername { get; set; }
        public string? ExternalApiPassword { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

}
