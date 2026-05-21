using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Precision_Engineering.Api.Dtos.InsightsDtos;
using Precision_Engineering.Bll.Insight;
using Precision_Engineering.DAL.Entities;



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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateInsight(CreateInsightDto dto)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var fileExtension = Path.GetExtension(dto.InsightImage.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new
                {
                    message = "Invalid ImageFormat"
                });

            }
            if (dto.InsightImage.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new
                {
                    message = "Image size must be less than 5 MB"
                });
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

        [HttpDelete("id")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveInsight(int id)
        {
            if (!insightsServise.RemoveInsightById(id))
            {
                return StatusCode(500, new
                {
                    message = "Something went wrong"
                });
            }
            return Ok(new
            {
                message = $"Insight with id : {id} removed successfuly"
            });
        }

        [HttpPut("Edit")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> EditInsight([FromForm]EditInsightDto dto)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var fileExtension = Path.GetExtension(dto.InsightImage.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new
                {
                    message = "Invalid ImageFormat"
                });

            }
            if (dto.InsightImage.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new
                {
                    message = "Image size must be less than 5 MB"
                });
            }
            var isedited = await insightsServise.EditInsight(dto.Id, dto.Title, dto.Description, dto.InsightImage, dto.ReadTimeInMinut, dto.Category);
            if(!isedited)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "SomeThing went wrong"
                });
            }
            return Ok(new
            {
                message = $"Insight with id {dto.Id} edited successfully."
            });
            
        }





    }
}
