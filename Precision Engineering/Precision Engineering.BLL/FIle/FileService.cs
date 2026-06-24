using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Precision_Engineering.DAL.Contexts;
using Precision_Engineering.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.BusinessLogic.FIle
{
    public class FileService : IFileService
    {
        private readonly PrecisionEngineeringDbContext dbContext;

        public FileService(PrecisionEngineeringDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<ServiseResult> EditFile(int id, string newfilename, string newdescription, IFormFile newfile)
        {

            try
            {
                var file = await dbContext.Files.FindAsync(id);
                if(file == null)
                {
                    return new ServiseResult
                    {
                        Success = false,
                        Message = "File not found"
                    };
                }
                var checkfilename = await dbContext.Files.AnyAsync(c => c.FileName == newfilename&& c.Id != id);
                if (checkfilename)
                {
                    return new ServiseResult
                    {
                        Success = false,
                        Message = "FileName must be unique"
                    };

                }

                var fullpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", file.FilePath.TrimStart('/'));
                if (File.Exists(fullpath))
                {
                    File.Delete(fullpath);
                }
                var fileextention = Path.GetExtension(newfile.FileName);
                var filename = $"{newfilename}{fileextention}";

                var folderpath = Path.Combine("wwwroot", "uploads", "files");
                Directory.CreateDirectory(folderpath);

                var filepath = Path.Combine(folderpath, filename);

                using (var stream = new FileStream(filepath, FileMode.Create))
                {
                    await newfile.CopyToAsync(stream);
                }

                file.FileName = newfilename;
                file.Description = newdescription;
                file.FilePath = $"/uploads/files/{filename}";
                file.Size = newfile.Length;
                file.Extension = fileextention;
                file.ContentType = newfile.ContentType;

                await dbContext.SaveChangesAsync();

                return new ServiseResult
                {
                    Success = true,
                    Message = "File edited successfully"
                };

            }

            catch
            {
                return new ServiseResult
                {
                    Success = false,
                    Message = "SomeThing went wrong"
                };
            }

        }

        public async Task<List<Files>> GetFiles()
        {
           try
            {
                var files = await dbContext.Files.ToListAsync();
                return files;
            }
            catch
            {
                return null;
               
            }
        }

        public async Task<ServiseResult> RemoveFile(int id)
        {
            try
            {
                var file = await dbContext.Files.FindAsync(id);
                if (file == null)
                {
                    return new ServiseResult
                    {
                        Success = false,
                        Message = "There is no file with this id"
                    };
                }
                var fullpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", file.FilePath.TrimStart('/'));
                if (File.Exists(fullpath))
                {
                    File.Delete(fullpath);
                }
                dbContext.Files.Remove(file);
                await dbContext.SaveChangesAsync();

                return new ServiseResult
                {
                    Success = true,
                    Message = "File removed successfully"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new ServiseResult
                {
                    Success = false,
                    Message = "Something went wrong"
                };
            }
        }

        public async Task<ServiseResult> UploadFile(string? description, IFormFile file, string filename)
        {
            try
            {
                var files = await dbContext.Files.Where(c => c.FileName == filename).FirstOrDefaultAsync();
                if (files != null)
                {
                    return new ServiseResult
                    {
                        Success = false,
                        Message = "FileName must be unice"
                    };
                }
                var extention = Path.GetExtension(file.FileName);
                var Filename = $"{filename}{extention}";

                var folderpath = Path.Combine("wwwroot", "uploads", "files");
                Directory.CreateDirectory(folderpath);

                var filepath = Path.Combine(folderpath, Filename);

                using (var stream = new FileStream(filepath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var File = new Files
                {
                    FileName = filename,
                    Description = description,
                    ContentType = file.ContentType,
                    Extension = extention,
                    UploadedAt = DateTime.UtcNow,
                    FilePath = $"/uploads/files/{Filename}",
                    Size = file.Length
                };
                await dbContext.Files.AddAsync(File);
                await dbContext.SaveChangesAsync();
                return new ServiseResult
                {
                    Success = true,
                    Message = "File uploaded Successfully"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new ServiseResult
                {
                    Success = false,
                    Message = "SomeThing WentWrong"
                };
            }



        }
    }
}
