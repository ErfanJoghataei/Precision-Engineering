using Precision_Engineering.DAL.Entities;

namespace Precision_Engineering.Api.Dtos.ProjectDtos
{
    public class GetProjectDto
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string ImagePath { get; set; } = default!;
        public ProjectsCategory Category { get; set; }
    }
}
