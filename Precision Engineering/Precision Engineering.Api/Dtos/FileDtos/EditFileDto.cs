namespace Precision_Engineering.Api.Dtos.FileDtos
{
    public class EditFileDto
    {
        public string NewFileName { get; set; } = default!;
        public string NewDescription { get; set; } = default!;
        public IFormFile NewFile { get; set; } = default!;


    }
}
