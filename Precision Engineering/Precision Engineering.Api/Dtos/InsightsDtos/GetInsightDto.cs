using Precision_Engineering.DAL.Entities;

namespace Precision_Engineering.Api.Dtos.InsightsDtos
{
    public class GetInsightDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string Description  { get; set; } = default!;
        public string ImagePath { get; set; } = default!;
        public InsightsCategory Category { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ReadTime { get; set; } = default!;
    }
}
