using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var messages = await dbcontext.Messages
                    .OrderByDescending(m => m.SentAt)
                    .ToListAsync();

                var dto = messages.Select(m => new GetMessageDto
                {
                    Id = m.Id,
                    FullName = m.FullName,
                    Email = m.Email,
                    MessageText = m.MessageText,
                    SentAt = m.SentAt
                }).ToList();

                return Ok(dto);
            }
            catch
            {
                return StatusCode(500, new { message = "Something went wrong" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            try
            {
                var message = await dbcontext.Messages.FindAsync(id);
                if (message == null)
                {
                    return NotFound(new { message = "Message not found" });
                }

                dbcontext.Messages.Remove(message);
                await dbcontext.SaveChangesAsync();

                return Ok(new { message = "Message deleted successfully" });
            }
            catch
            {
                return StatusCode(500, new { message = "Something went wrong" });
            }
        }

        [HttpPost("Send")]
        public async Task<IActionResult> SendMessage(SendMessageDto dto)
        {
            
            var pass = BCrypt.Net.BCrypt.HashPassword("123");
            var admin = new Admin
            {
                UserName = "admin",
                PasswordHash = pass,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
            };
            dbcontext.Admins.Add(admin);
            dbcontext.SaveChanges();
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
