using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Precision_Engineering.Api.Dtos.Account_Dtos;
using Precision_Engineering.DAL.Contexts;
using Precision_Engineering.Bll.Jwt_Token;


namespace Precision_Engineering.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly PrecisionEngineeringDbContext dbContext;
        private readonly IJwtServise jwtServise;

        public AccountController(PrecisionEngineeringDbContext dbContext, IJwtServise jwtServise)
        {
            this.dbContext = dbContext;
            this.jwtServise = jwtServise;
        }
        [HttpPost("Login")]
        public async Task<IActionResult> LoginAdmin(LoginDto dto)
        {
            var admin = await dbContext.Admins.Where(c => c.UserName == dto.UserName).FirstOrDefaultAsync();
            if (admin == null)
            {
                return Unauthorized(new { message = $"Admin With UserName:{dto.UserName} Doesnt Exist" });
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
            {
                return BadRequest(new { message = "UesrName or Password is incorrect" });
            }
            var token = jwtServise.CreateToken(admin.Id.ToString(), admin.UserName, "Admin");
            admin.LastLoginAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
            return Ok(new
            {
                message = "Admin Logined successfully",
                accessToken = token
            });
        }

    }
}
