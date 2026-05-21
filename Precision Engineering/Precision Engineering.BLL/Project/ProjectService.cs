using Microsoft.AspNetCore.Http;
using Precision_Engineering.DAL.Contexts;
using Precision_Engineering.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.BusinessLogic.Project
{
    public class ProjectService : IProjectService
    {
        private readonly PrecisionEngineeringDbContext dbContext;

        public ProjectService(PrecisionEngineeringDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<bool> CreateProject(string title, string description, ProjectsCategory category, IFormFile projectimage)
        {
            try
            {
                var imageextention = Path.GetExtension(projectimage.FileName);

                var filename = $"{Guid.NewGuid()}{imageextention}";

                var folderpath = Path.Combine("wwwroot", "uploads", "projects");
                Directory.CreateDirectory(folderpath);

                var filepath = Path.Combine(folderpath, filename);

                using (var streem = new FileStream(filepath, FileMode.Create))
                {
                    projectimage.CopyTo(streem);
                }

                var project = new Projects
                {
                    Title = title,
                    Description = description,
                    Category = category,
                    IamgeUrl = $"/uploads/projects/{filename}"
                };

                await dbContext.Projects.AddAsync(project);
                await dbContext.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return false;
            }


        }

        public async Task<bool> EditProject(int id, string newtitle, string newdescription, IFormFile newimage, ProjectsCategory newcategory)
        {
            try
            {
                var project = await dbContext.Projects.FindAsync(id);

                var fullpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", project.IamgeUrl.TrimStart("/").ToString());
                if (File.Exists(fullpath))
                {
                    File.Delete(fullpath);
                }

                var imageextention = Path.GetExtension(newimage.FileName);
                var filename = $"{Guid.NewGuid()}{imageextention}";

                var folderpath = Path.Combine("wwwroot", "uploads", "projects");
                Directory.CreateDirectory(folderpath);

                var filepath = Path.Combine(folderpath, filename);

                using (var streem = new FileStream(filepath, FileMode.Create))
                {
                    await newimage.CopyToAsync(streem);
                }


                project.Title = newtitle;
                project.Description = newdescription;
                project.Category = newcategory;
                project.IamgeUrl = $"/uploads/projects/{filename}";

                await dbContext.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }



        }

        public async Task<bool> RemoveProject(int id)
        {
            try
            {
                var project = new Projects
                {
                    Id = id
                };
                dbContext.Projects.Remove(project);
                await dbContext.SaveChangesAsync();
                return true;

            }
            catch { return false; }


        }
    }
}
