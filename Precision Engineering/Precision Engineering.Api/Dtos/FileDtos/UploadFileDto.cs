using Microsoft.AspNetCore.Routing.Constraints;
using System.ComponentModel.DataAnnotations;

namespace Precision_Engineering.Api.Dtos.FileDtos
{
    public class UploadFileDto
    {


        [Required(ErrorMessage = "FileName is required")]
        [MaxLength(100)]
        public string FileName { get; set; } = default!;

        [MaxLength(1000)]
        public string? Description { get; set; } = default!;



        [Required(ErrorMessage = "File is required")]
        public IFormFile File { get; set; } = default!;


    }
}
