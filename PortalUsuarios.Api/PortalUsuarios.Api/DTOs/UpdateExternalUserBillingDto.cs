namespace PortalUsuarios.Api.DTOs
{
    public class UpdateExternalUserBillingDto
    {
        public string ruc { get; set; } = string.Empty;
        public string razon_social { get; set; } = string.Empty;
        public string nombre_comercial { get; set; } = string.Empty;
        public string direccion { get; set; } = string.Empty;
        public string telefono { get; set; } = string.Empty;
        public string obligado_contabilidad { get; set; } = "SI";
        public string nombre_firma { get; set; } = string.Empty;
        public string password_sign { get; set; } = string.Empty;
        public string ruta_logo { get; set; } = string.Empty;
    }

}
