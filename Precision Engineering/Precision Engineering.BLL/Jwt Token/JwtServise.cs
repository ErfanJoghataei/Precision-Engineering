using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Precision_Engineering.DAL.Contexts;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Security.Claims;
using System.Text;

namespace Precision_Engineering.Bll.Jwt_Token
{
    public class JwtServise : IJwtServise
    {
        private readonly IConfiguration configuration;
        private readonly PrecisionEngineeringDbContext dbContext;

        public JwtServise(IConfiguration configuration,PrecisionEngineeringDbContext dbContext)
        {
            this.configuration = configuration;
            this.dbContext = dbContext;
        }
        public async Task<string> CreateToken(string id, string username, string role)
        {
            var info = configuration.GetSection("Jwt");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes( info.Key));

            var creadintials = new SigningCredentials(key,SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, id),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(ClaimTypes.Role , role),
                new Claim(JwtRegisteredClaimNames.Jti , Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: info["Issuer"],
                audience : info["Audience"],
                claims : claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(info["ExpireMinutes"])),
                    signingCredentials: creadintials
                );
            var admin = await dbContext.Admins.Where(c=>c.UserName == username).FirstOrDefaultAsync();
            admin.LastLoginAt = DateTime.UtcNow;
            await  dbContext.SaveChangesAsync();
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
