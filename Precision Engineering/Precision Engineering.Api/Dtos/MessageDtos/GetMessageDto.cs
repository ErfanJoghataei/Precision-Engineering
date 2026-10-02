namespace Precision_Engineering.Api.Dtos.MessageDtos
{
    public class GetMessageDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string MessageText { get; set; } = default!;
        public DateTime SentAt { get; set; }
    }
}
