using Precision_Engineering.DAL.Entities;

namespace Precision_Engineering.Api.Dtos.InsightsDtos
{
    public class GetInsightDto
    {
        public string Title { get; set; } = default!;
        public string Description  { get; set; } = default!;
        public IFormFile Image { get; set; } = default!;
        public InsightsCategory Category { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ReadTimeInMinute { get; set; }
    }
}
