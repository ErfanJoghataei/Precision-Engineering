using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Precision_Engineering.Api.Dtos.Project;
using Precision_Engineering.Api.Dtos.ProjectDtos;
using Precision_Engineering.BusinessLogic.Project;
using Precision_Engineering.DAL.Entities;

namespace Precision_Engineering.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService projectservice;

        public ProjectController(IProjectService projectservice)
        {
            this.projectservice = projectservice;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm]CreateProjectDto dto)
        {
            if (!CheckImageSize(dto.ProjectImage))
            {
                return BadRequest(new
                {
                    message = "Image size must be less than 5 MB"
                });

            }
            if (!CheckImageformat(dto.ProjectImage))
            {
                return BadRequest(new
                {
                    message = "Image format is not valid"
                });
            }
            var iscreated = await projectservice.CreateProject(dto.Title, dto.Description, dto.Category, dto.ProjectImage);
            if (!iscreated)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Something went wrong"
                });
            }
            return Ok(new
            {
                message = "Project created successfully"
            });

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var isdeleted = await projectservice.RemoveProject(id);
            if (!isdeleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Something went wrong"
                });
            }
            return Ok(new
            {
                message = "Project Removed successfully"
            });

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id,EditProjectDto dto)
        {
            if(!CheckImageSize(dto.newimage))
            {
                return BadRequest(new
                {
                    message = "Image size must be less than 5 MB"
                });
            }
            if(!CheckImageformat(dto.newimage))
            {
                return BadRequest(new
                {
                    message = "Image format is not valid"
                });
            }
            var isedited = await projectservice.EditProject(id, dto.newtitle, dto.newdescription, dto.newimage, dto.newcategory);
            if(!isedited)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Something went wrong"
                });
            }
            return Ok(new
            {
                message = "Project edited successfully"
            });
        }


        public bool CheckImageformat(IFormFile image)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return false;

            }

            return true;
        }
        public bool CheckImageSize(IFormFile image)
        {
            if (image.Length > 5 * 1024 * 1024)
            {
                return false;

            }
            return true;
        }
    }
}
