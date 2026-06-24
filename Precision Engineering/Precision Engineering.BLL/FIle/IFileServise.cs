using Microsoft.AspNetCore.Http;
using Precision_Engineering.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.BusinessLogic.FIle
{
    public interface IFileService
    {
        Task<ServiseResult> UploadFile(string? description, IFormFile file, string filename);
        Task<ServiseResult> RemoveFile(int id);
        Task<ServiseResult> EditFile(int id, string newfilename, string newdescription, IFormFile newfile);
        Task<List<Files>> GetFiles();
    }
}
