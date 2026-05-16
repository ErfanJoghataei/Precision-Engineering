using System.ComponentModel.DataAnnotations;

namespace Precision_Engineering.Api.Dtos.Account_Dtos
{
    public class LoginDto
    {
        [Required(ErrorMessage = "UserName Is Required")]
        public string UserName { get; set; } = default!;
        [Required(ErrorMessage = "UserName Is Required")]
        public string Password { get; set; } = default!;
    }
}
