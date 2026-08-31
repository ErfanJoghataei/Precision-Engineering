using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Precision_Engineering.DAL.Contexts;

public sealed class PrecisionEngineeringDbContextFactory
    : IDesignTimeDbContextFactory<PrecisionEngineeringDbContext>
{
    public PrecisionEngineeringDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__cnnstring")
            ?? "Server=(localdb)\\MSSQLLocalDB;Database=PrecisionEngineering;Trusted_Connection=True;TrustServerCertificate=True";

        var optionsBuilder = new DbContextOptionsBuilder<PrecisionEngineeringDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new PrecisionEngineeringDbContext(optionsBuilder.Options);
    }
}

