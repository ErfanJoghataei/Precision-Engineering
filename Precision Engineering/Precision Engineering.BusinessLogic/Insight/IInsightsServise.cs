using Microsoft.AspNetCore.Http;
using Precision_Engineering.DAL.Entities;



namespace Precision_Engineering.BusinessLogic.Insight
{
    public interface IInsightsServise
    {
        Task<bool> CreateInsight(string title,string description, IFormFile insightimage, int raedtime,InsightsCategory insightsCategory);
    }
}
