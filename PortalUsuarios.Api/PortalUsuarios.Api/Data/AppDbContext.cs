using Microsoft.EntityFrameworkCore;
using PortalUsuarios.Api.Models;
using System.Reflection.Emit;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<PortalUser> PortalUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PortalUser>(entity =>
        {
            entity.ToTable("PortalUsers");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Username)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.HasIndex(x => x.Username)
                  .IsUnique();

            entity.Property(x => x.PasswordHash)
                  .HasMaxLength(255)
                  .IsRequired();

            entity.Property(x => x.ExternalApiUsername)
                  .HasMaxLength(100);

            entity.Property(x => x.ExternalApiPassword)
                  .HasMaxLength(255);

            entity.Property(x => x.Email)
                  .HasMaxLength(150)
                  .IsRequired();

            entity.Property(x => x.FullName)
                  .HasMaxLength(150)
                  .IsRequired();

            entity.Property(x => x.RoleName)
                  .HasMaxLength(30)
                  .IsRequired();

            entity.Property(x => x.IsActive)
                  .IsRequired();

            entity.Property(x => x.CreatedAt)
                  .IsRequired();
        });
    }
}