using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Precision_Engineering.Api.Dtos.InsightsDtos;
using Precision_Engineering.BusinessLogic.Insight;
using Precision_Engineering.DAL.Entities;
using static System.Net.Mime.MediaTypeNames;



namespace Precision_Engineering.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InsightsController : ControllerBase
    {
        private readonly IInsightsServise insightsServise;

        public InsightsController(IInsightsServise insightsServise)
        {
            this.insightsServise = insightsServise;
        }

        [HttpPost("Create")]
        [Authorize]
        public async Task<IActionResult> CreateInsight(CreateInsightDto dto)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var fileextention = Path.GetExtension(dto.InsightImage.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileextention))
            {
                return BadRequest(new
                {
                    message = "Invalid ImageFormat"
                });

            }
            if (dto.InsightImage.Length > 5 * 1024 * 1024)
            {

            }
            var issuccsec = await insightsServise.CreateInsight(dto.Title, dto.Description, dto.InsightImage, dto.ReadTimeInMinutes, dto.Category);
            if (!issuccsec)
            {
                return StatusCode(500, new { message = "Something went wrong" });
            }
            return Ok(new
            {
                message = "Insight created successfuly"
            });
        }


    }
}
