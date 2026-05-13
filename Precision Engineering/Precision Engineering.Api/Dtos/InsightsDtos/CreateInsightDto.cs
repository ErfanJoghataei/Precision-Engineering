using Precision_Engineering.DAL.Entities;
using System.ComponentModel.DataAnnotations;

namespace Precision_Engineering.Api.Dtos.InsightsDtos
{
    public class CreateInsightDto
    {
        [Required(ErrorMessage ="Category is required!")]
        public InsightsCategory Category { get; set; }
        [Required(ErrorMessage = "Image is required!")]
        public IFormFile InsightImage { get; set; } = default!;
        [Required(ErrorMessage = "Title is required!")]
        [MaxLength(70)]
        public string Title { get; set; } = default!;
        [Required(ErrorMessage = "Description is required!")]
        [MaxLength(1000)]
        public string Description { get; set; } = default!;
        [Required(ErrorMessage = "ReadTime is required!")]
        public int ReadTimeInMinutes { get; set; } = default!;
    }
}
