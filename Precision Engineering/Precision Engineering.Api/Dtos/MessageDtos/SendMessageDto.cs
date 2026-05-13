using System.ComponentModel.DataAnnotations;

namespace Precision_Engineering.Api.Dtos.MessageDtos
{
    public class SendMessageDto
    {
        [Required(ErrorMessage ="FullName Is Required!")]
        [MaxLength(100)]
        public string FullName { get; set; } = default!;


        [Required(ErrorMessage ="Email Is Required!")]
        [EmailAddress(ErrorMessage ="Email Address Is Not Correct!")]
        [MaxLength(150)]
        public string Email { get; set; } = default!;

        [Required(ErrorMessage ="Message Is Required!")]
        [MaxLength(1000)]
        public string MessageText { get; set; } = default!;
    }
}
