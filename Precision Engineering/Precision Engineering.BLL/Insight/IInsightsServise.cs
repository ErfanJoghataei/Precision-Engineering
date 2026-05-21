using Microsoft.AspNetCore.Http;
using Precision_Engineering.DAL.Entities;



namespace Precision_Engineering.Bll.Insight
{
    public interface IInsightsServise
    {
        Task<bool> CreateInsight(string title, string description, IFormFile insightimage, int raedtime, InsightsCategory insightsCategory);
        bool RemoveInsightById(int id);

        Task<Insights> GetInsightWithId(int id);

        Task<bool> EditInsight(int id,string newtitle, string newdescription, IFormFile newinsightimage, int newraedtime, InsightsCategory newinsightsCategory);
    }
}
