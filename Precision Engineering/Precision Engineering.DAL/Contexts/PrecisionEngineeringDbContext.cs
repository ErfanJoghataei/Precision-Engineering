using Microsoft.EntityFrameworkCore;
using Precision_Engineering.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.DAL.Contexts
{
    public class PrecisionEngineeringDbContext:DbContext
    {
        public PrecisionEngineeringDbContext(DbContextOptions options) : base(options)
        {
        }

        protected PrecisionEngineeringDbContext()
        {
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Files> Files { get; set; }
        public DbSet<Insights> Insights { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Projects> Projects { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

    }
}
