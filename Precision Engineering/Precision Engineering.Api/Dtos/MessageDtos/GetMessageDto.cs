namespace Precision_Engineering.Api.Dtos.MessageDtos;

public sealed class GetMessageDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MessageText { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
}

