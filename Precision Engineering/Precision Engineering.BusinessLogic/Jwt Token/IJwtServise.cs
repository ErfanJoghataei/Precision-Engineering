using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Precision_Engineering.BusinessLogic.Jwt_Token
{
    public interface IJwtServise
    {
        string CreateToken(string id, string username, string role);
    }
}
