using Precision_Engineering.DAL.Entities;
using System.ComponentModel.DataAnnotations;

namespace Precision_Engineering.Api.Dtos.InsightsDtos
{
    public class EditInsightDto
    {
        [Required(ErrorMessage ="Id is required")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(70)]
        public string Title { get; set; } = default!;
        [Required(ErrorMessage = "Description is required")]
        [MaxLength(1000)]
        public string Description { get; set; } = default!;
        [Required(ErrorMessage = "InsightImage is required")]
        public IFormFile InsightImage { get; set; } = default!;
        [Required(ErrorMessage = "ReadTime is required")]
        public int ReadTimeInMinut { get; set; }
        [Required(ErrorMessage = "Category is required")]
        public InsightsCategory Category { get; set; }
    }
}
