using System.Collections.Generic;
using System.Threading.Tasks;
using RestSharp;
using RicoCore.Services.Systems.Mailling.Dtos;

namespace RicoCore.Services.Systems.Mailling
{
    public interface IMailingService
    {
        /// <summary>
        /// Recurring task for hangfire
        /// </summary>
        /// <returns></returns>
        Task SendMailProcessAsync();

        /// <summary>
        /// Add mail to queue system
        /// </summary>
        /// <param name="model"></param>
        /// <param name="hasSave"></param>
        /// <returns></returns>
        Task AddMailToQueueAsync(MailQueueViewModel model);

        Task<IRestResponse> SendSingleByMailGunAsync(string to, string subject, string body);

        Task<IRestResponse> SendByMailGun(Dictionary<string, object> vars, string subject, string body);


        string GetTemplate(string tofullName, string content);

        Task SaveAsync();
    }
}