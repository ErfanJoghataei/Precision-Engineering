using Precision_Engineering.DAL.Entities;

namespace Precision_Engineering.Api.Dtos.ProjectDtos
{
    public class GetProjectDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
        public ProjectsCategory MyProperty { get; set; }
    }
}
