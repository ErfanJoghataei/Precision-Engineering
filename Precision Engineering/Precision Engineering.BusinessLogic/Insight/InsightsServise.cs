using Microsoft.AspNetCore.Http;

using Precision_Engineering.DAL.Contexts;
using Precision_Engineering.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.BusinessLogic.Insight
{
    public class InsightsServise : IInsightsServise
    {
        private readonly PrecisionEngineeringDbContext dbContext;

        public InsightsServise(PrecisionEngineeringDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<bool> CreateInsight(string title, string description, IFormFile insightimage, int readtime, InsightsCategory insightsCategory)
        {
            try
            {
                var extentions = Path.GetExtension(insightimage.FileName);
                string filename = $"{Guid.NewGuid()}{extentions}";

                var folderpath = Path.Combine("wwwroot", "uploads", "insights");
                Directory.CreateDirectory(folderpath);

                var filepath = Path.Combine(folderpath, filename);

                using (var streem = new FileStream(filepath, FileMode.Create))
                {
                    await insightimage.CopyToAsync(streem);
                }

                var insight = new Insights
                {
                    Title = title,
                    Description = description,
                    ReadTime = $"min read{readtime}",
                    ImagePath = $"/uploads/insights/{filename}",
                    Category = insightsCategory,
                    CreatedAt = DateTime.UtcNow
                };

                await dbContext.Insights.AddAsync(insight);
                await dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
