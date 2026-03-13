namespace PortalUsuarios.Api.DTOs
{
    public class UpdateExternalUserDto
    {
        public string usuario { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string full_name { get; set; } = string.Empty;
        public string identificacion { get; set; } = string.Empty;
        public int profile_id { get; set; }
        public bool active { get; set; }
    }

}
