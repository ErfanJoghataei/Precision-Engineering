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
        public async Task<bool> AddProject(string title, string description, ProjectsCategory category, IFormFile projectimage)
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
    }
}
