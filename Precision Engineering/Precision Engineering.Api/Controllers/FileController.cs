using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Precision_Engineering.Api.Dtos.FileDtos;
using Precision_Engineering.BusinessLogic.FIle;
using Precision_Engineering.DAL.Contexts;

namespace Precision_Engineering.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService fileServise;

        public FileController(IFileService fileServise)
        {
            this.fileServise = fileServise;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var files = await fileServise.GetFiles();
            if (files == null)
            {
                return StatusCode(500, new { message = "Something went wrong" });
            }

            var dto = files.Select(c => new GetFileDto
            {
                Id = c.Id,
                FileName = c.FileName,
                Description = c.Description ?? string.Empty,
                Format = c.Extension,
                Size = c.Size,
                UploadedAt = c.UploadedAt,
                FilePath = c.FilePath
            }).ToList();

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Upload([FromForm] UploadFileDto dto)
        {
            if (!CheckFileSize(dto.File))
            {
                return BadRequest(new
                {
                    message = "File size must be lass than 5 MB"
                });
            }
            var fileextention = Path.GetExtension(dto.File.FileName).ToLower();
            if (fileextention != ".pdf")
            {
                return BadRequest(new
                {
                    message = "File must be .pdf"
                });
            }

            var result = await fileServise.UploadFile(dto.Description, dto.File, dto.FileName);
            if (!result.Success)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }
            return Ok(new
            {
                message = result.Message
            });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var result = await fileServise.RemoveFile(id);
            if (!result.Success)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }
            return Ok(new
            {
                message = result.Message
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id,[FromForm]EditFileDto dto)
        {
            if(!CheckFileSize(dto.NewFile))
            {
                return BadRequest( new
                {
                    message = "File size must be less than 5 MB"
                });
            }
            var fileextention = Path.GetExtension(dto.NewFile.FileName).ToLower();
            if(fileextention != ".pdf")
            {
                return BadRequest(new
                {
                    message = "File must be .pdf"
                });
            }
            var resutl = await fileServise.EditFile(id, dto.NewFileName, dto.NewDescription, dto.NewFile);
            if(!resutl.Success)
            {
                if(resutl.Message == "File not found")
                {
                    return NotFound(new
                    {
                        message = resutl.Message
                    });
                }
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = resutl.Message
                });
            }
            return Ok(new
            {
                message = resutl.Message
            });
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> AddDownloadCount(int id,PrecisionEngineeringDbContext dbContext)
        {
            var file = await dbContext.Files.FindAsync(id);
            if (file is null)
            {
                return NotFound(new { message = "File not found" });
            }

            file.DownloadCount++;
            await dbContext.SaveChangesAsync();
            return Ok(new
            {
                message = "Download count added Succesfully"
            });
        }


        public bool CheckFileformat(IFormFile image)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return false;

            }

            return true;
        }
        public bool CheckFileSize(IFormFile file)
        {
            if (file.Length > 5 * 1024 * 1024)
            { 
                return false;

            }
            return true;
        }
    }
}
