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
            var insights = await dbContext.Insights.ToListAsync();
            var insightscount = insights.Count();

            var projects = await dbContext.Insights.ToListAsync();
            var projectscount = insights.Count();

            var downloads = await dbContext.Insights.ToListAsync();
            var downloadscount = insights.Count();

            var messages = await dbContext.Insights.ToListAsync();
            var messagescount = insights.Count();


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
