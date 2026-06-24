using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Precision_Engineering.Api.Dtos.FileDtos;
using Precision_Engineering.Api.Dtos.HomeDtos;
using Precision_Engineering.Api.Dtos.InsightsDtos;
using Precision_Engineering.Api.Dtos.ProjectDtos;
using Precision_Engineering.Bll.Insight;
using Precision_Engineering.BusinessLogic.FIle;
using Precision_Engineering.BusinessLogic.Project;

namespace Precision_Engineering.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IInsightsServise insightsServise;
        private readonly IProjectService projectService;
        private readonly IFileService fileService;
        private readonly IWebHostEnvironment env;

        public HomeController(IInsightsServise insightsServise, IProjectService projectService, IFileService fileService, IWebHostEnvironment env)
        {
            this.insightsServise = insightsServise;
            this.projectService = projectService;
            this.fileService = fileService;
            this.env = env;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var dto = new GetHomeDto();
            var insights = await insightsServise.GetInsights();
            var projects = await projectService.GetProjects();
            var files = await fileService.GetFiles();

            dto.Insights = insights.Select(c => new GetInsightDto
            {
                Title = c.Title,
                Description = c.Description,
                Category = c.Category,
                ReadTime = $"{c.ReadTime} Min Read",        
                ImagePath = c.ImagePath
            }).ToList();

            dto.Projects = projects.Select(c=> new GetProjectDto 
            { 
            Title= c.Title,
            Description = c.Description,
            Category = c.Category,
            ImagePath = c.IamgeUrl        
            }).ToList();

            dto.Files = files.Select(c=> new GetFileDto 
            { 
                FileName = c.FileName,
                Description = c.Description,
                Format = c.Extension,
                FilePath = c.FilePath,
                Size = c.Size,
                UploadedAt = c.UploadedAt
            }).ToList();

            return Ok(dto);
        }
    }
}
