using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Security.Claims;
using System.Text;

namespace Precision_Engineering.BusinessLogic.Jwt_Token
{
    public class JwtServise : IJwtServise
    {
        private readonly IConfiguration configuration;

        public JwtServise(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public string CreateToken(string id, string username, string role)
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
           return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
