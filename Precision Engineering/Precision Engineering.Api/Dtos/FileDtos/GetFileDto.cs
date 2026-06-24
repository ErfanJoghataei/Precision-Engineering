namespace Precision_Engineering.Api.Dtos.FileDtos
{
    public class GetFileDto
    {
        public string FileName { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Format { get; set; } = default!;
        public DateTime UploadedAt { get; set; }
        public long Size { get; set; }
        public string FilePath { get; set; } = default!;

    }
}
