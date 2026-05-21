using Microsoft.AspNetCore.Http;
using Precision_Engineering.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.BusinessLogic.Project
{
    public interface IProjectService
    {
        Task<bool> CreateProject(string title, string description, ProjectsCategory category, IFormFile projectimage);
        Task<bool> RemoveProject(int id);
        Task<bool> EditProject(int id, string newtitle, string newdescription, IFormFile newimage, ProjectsCategory newcategory);

    }
}
