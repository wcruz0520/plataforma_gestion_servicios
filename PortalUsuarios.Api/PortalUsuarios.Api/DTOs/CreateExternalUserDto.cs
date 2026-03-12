namespace PortalUsuarios.Api.DTOs
{
    public class CreateExternalUserDto
    {
        public string usuario { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public string full_name { get; set; }
        public int profile_id { get; set; }
        public string identificacion { get; set; }
    }
}
