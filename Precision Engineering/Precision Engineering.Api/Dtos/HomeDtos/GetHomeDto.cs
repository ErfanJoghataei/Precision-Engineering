using Precision_Engineering.Api.Dtos.FileDtos;
using Precision_Engineering.Api.Dtos.InsightsDtos;
using Precision_Engineering.Api.Dtos.ProjectDtos;

namespace Precision_Engineering.Api.Dtos.HomeDtos
{
    public class GetHomeDto
    {
        public List<GetInsightDto> Insights { get; set; } = new List<GetInsightDto>();
        public List<GetProjectDto> Projects { get; set; } = new List<GetProjectDto>();
        public List<GetFileDto> Files { get; set; } = new List<GetFileDto>();
    }
}
