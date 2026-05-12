using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.DAL.Entities
{
    public class Projects
    {
        public int Id { get; set; }

        public string IamgeUrl { get; set; } = default!;
        public ProjectsCategory Category { get; set; }

        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;



    }

    public enum ProjectsCategory
    {
        Infrastructure,
        Structural,
        Environmental,
        Transportation
    }
}
