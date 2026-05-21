using Microsoft.AspNetCore.Http;

using Precision_Engineering.DAL.Contexts;
using Precision_Engineering.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Precision_Engineering.Bll.Insight;

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
            Console.WriteLine(ex);
            return false;
        }
    }

    public async Task<bool> EditInsight(int id, string newtitle, string newdescription, IFormFile newinsightimage, int newraedtime, InsightsCategory newinsightsCategory)
    {
        try
        {
            var extention = Path.GetExtension(newinsightimage.FileName);
            var filename = $"{Guid.NewGuid()} {extention}";

            var folderpath = Path.Combine("wwwroot", "uploads", "insights");
            Directory.CreateDirectory(folderpath);

            var filepath = Path.Combine(folderpath, filename);

            using (var streem = new FileStream(filepath, FileMode.Create))
            {
                newinsightimage.CopyTo(streem);
            }

            var insight = await dbContext.Insights.FindAsync(id);
            insight.Title = newtitle;
            insight.Description = newdescription;
            insight.ImagePath = $"/uploads/insights/{filename}";
            insight.ReadTime = $"{newraedtime} Min Read ";
            insight.Category = newinsightsCategory;

            await dbContext.SaveChangesAsync();

            return true;
        }
        catch { return false; }
    }

    public Task<Insights> GetInsightWithId(int id)
    {
        throw new NotImplementedException();
    }

    public bool RemoveInsightById(int id)
    {
        try
        {
            var insight = new Insights
            {
                Id = id
            };

            dbContext.Insights.Remove(insight);
            return true;
        }
        catch { return false; }

    }
}
