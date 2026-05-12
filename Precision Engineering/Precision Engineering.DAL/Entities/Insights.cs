using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.DAL.Entities
{
    public class Insights
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = default!;
        public InsightsCategory Category { get; set; }
        public string Description { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public string ReadTime { get; set; } = default!;


    }

    public enum InsightsCategory
    {
        Sustainability,
        Structural,
        Technology,
        Environmental
    }
}
