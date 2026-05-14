using Microsoft.AspNetCore.Mvc;
using Precision_Engineering.Api.Dtos.MessageDtos;
using Precision_Engineering.DAL.Contexts;
using Precision_Engineering.DAL.Entities;

namespace Precision_Engineering.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly PrecisionEngineeringDbContext dbcontext;

        public ContactController(PrecisionEngineeringDbContext Dbcontext)
        {
            dbcontext = Dbcontext;
        }

        [HttpPost("Send")]
        public async Task<IActionResult> SendMessage(SendMessageDto dto)
        {
            try
            {
                var message = new Message
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    MessageText = dto.MessageText,
                    SentAt = DateTime.UtcNow
                };
                await dbcontext.Messages.AddAsync(message);
                await dbcontext.SaveChangesAsync();
                Response.StatusCode = 200;
                return Ok(new {message = "Message Sent successfully" });
            }
            catch
            {
                return StatusCode(500 , new {message = "SomeThing Went Wrong!"});
            }
         
        }

    }
}
