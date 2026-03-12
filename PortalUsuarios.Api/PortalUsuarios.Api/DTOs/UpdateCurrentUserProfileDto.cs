namespace PortalUsuarios.Api.DTOs
{
    public class UpdateCurrentUserProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public string? ExternalApiUsername { get; set; }
        public string? ExternalApiPassword { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }

}
