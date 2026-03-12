namespace PortalUsuarios.Api.DTOs
{
    public class PortalUserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? ExternalApiUsername { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
