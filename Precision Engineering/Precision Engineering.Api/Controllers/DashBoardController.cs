using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Precision_Engineering.Api.Dtos.DashboardDtos;
using Precision_Engineering.DAL.Contexts;

namespace Precision_Engineering.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {
        private readonly PrecisionEngineeringDbContext dbContext;

        public DashBoardController(PrecisionEngineeringDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var insightscount = await dbContext.Insights.CountAsync();
            var projectscount = await dbContext.Projects.CountAsync();
            var downloadscount = await dbContext.Files.CountAsync();
            var messagescount = await dbContext.Messages.CountAsync();

            var model = new GetDashboardDto
            {
                InsightsCount = insightscount,
                ProjectsCount = projectscount,
                DownloadsCount = downloadscount,
                MessagesCount = messagescount
            };
            return Ok(model);
        }
    }
}
