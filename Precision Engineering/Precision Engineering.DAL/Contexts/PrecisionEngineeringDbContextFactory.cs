using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.DAL.Contexts
{
    public class PrecisionEngineeringDbContextFactory
        : IDesignTimeDbContextFactory<PrecisionEngineeringDbContext>
    {
        public PrecisionEngineeringDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder =
                new DbContextOptionsBuilder<PrecisionEngineeringDbContext>();

            optionsBuilder.UseSqlServer(
                "Server=.;Database=PrecisionEngineeringDb;Trusted_Connection=True;TrustServerCertificate=True");

            return new PrecisionEngineeringDbContext(optionsBuilder.Options);
        }
    }
}
