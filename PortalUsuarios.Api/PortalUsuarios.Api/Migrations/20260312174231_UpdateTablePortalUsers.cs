using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortalUsuarios.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTablePortalUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExternalApiPassword",
                table: "PortalUsers",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExternalApiUsername",
                table: "PortalUsers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalApiPassword",
                table: "PortalUsers");

            migrationBuilder.DropColumn(
                name: "ExternalApiUsername",
                table: "PortalUsers");
        }
    }
}
