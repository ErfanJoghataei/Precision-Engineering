using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Text;

namespace Precision_Engineering.DAL.Entities
{
    public class Files
    {

            public int Id { get; set; }

       

            public string? Description { get; set; }

         
            public string FileName { get; set; } = default!;

          
            public string FilePath { get; set; } = default!;


            public string ContentType { get; set; } = default!;


            public string Extension { get; set; } = default!;

           
            public long Size { get; set; }

     
            public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        

    }
}
