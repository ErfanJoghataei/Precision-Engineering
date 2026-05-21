using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Precision_Engineering.Bll.Jwt_Token
{
    public interface IJwtServise
    {
        Task<string> CreateToken(string id, string username, string role);
    }
}
