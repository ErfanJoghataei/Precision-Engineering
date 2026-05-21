using Precision_Engineering.DAL.Entities;

namespace Precision_Engineering.Api.Dtos.ProjectDtos
{
    public class EditProjectDto
    {

        public string newtitle { get; set; } = default!;
        public string newdescription { get; set; } = default!;
        public IFormFile newimage { get; set; } = default!;
        public ProjectsCategory newcategory { get; set; } = default!;
    }
}
