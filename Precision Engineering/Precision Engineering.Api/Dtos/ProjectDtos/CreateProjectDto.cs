using Precision_Engineering.Api.Controllers;
using Precision_Engineering.DAL.Entities;
using System.ComponentModel.DataAnnotations;

namespace Precision_Engineering.Api.Dtos.Project
{
    public class CreateProjectDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(100)]
        public string Title { get; set; } = default!;
        [Required(ErrorMessage = "Description is required")]
        [MaxLength(1000)]
        public string Description { get; set; } = default!;
        [Required(ErrorMessage = "Image is required")]
        public IFormFile ProjectImage { get; set; } = default!;
        [Required(ErrorMessage = "Category is required")]

        public ProjectsCategory Category { get; set; } = default!;

    }
}

