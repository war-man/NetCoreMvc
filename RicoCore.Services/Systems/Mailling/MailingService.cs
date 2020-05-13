using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;
using RicoCore.Services.Systems.Mailling.Dtos;
using RicoCore.Utilities.Constants;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using RicoCore.Data.EF;
using RicoCore.Data.Entities.System;
using Microsoft.AspNetCore.Hosting;

namespace RicoCore.Services.Systems.Mailling
{
    public class MailingService : IMailingService
    {
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _hostingEnv;
        private readonly AppDbContext _context;
        private readonly EmailSettings _emailSettings;

        public MailingService(
            IMapper mapper, IConfiguration configuration, IHostingEnvironment hostingEnv,
            IOptions<EmailSettings> emailOptions, AppDbContext context)
        {
            _emailSettings = emailOptions.Value;
            _mapper = mapper;
            _configuration = configuration;
            _hostingEnv = hostingEnv;
            _context = context;
        }

        public async Task AddMailToQueueAsync(MailQueueViewModel model)
        {
            MailQueue mailQueue = _mapper.Map<MailQueueViewModel, MailQueue>(model);
            await _context.MailQueues.AddAsync(mailQueue);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task SendMailProcessAsync()
        {
            List<MailQueue> queue = await _context.MailQueues.Where(x => x.IsSend == false)
                .OrderBy(x => x.DateCreated)
                .Take(_emailSettings.NumberEmailEachTimes)
                .ToListAsync();

            if (queue.Count > 0)
            {
                DateTime currentDate = DateTime.Now;
                foreach (MailQueue item in queue)
                {
                    await SendSingleByMailGunAsync(item.ToAddress, item.Subject, item.Body);
                    item.SendDate = currentDate;
                    item.IsSend = true;
                    _context.MailQueues.Update(item);
                }
                await SaveAsync();
            }
        }

        public async Task<IRestResponse> SendSingleByMailGunAsync(string to, string subject, string body)
        {
            RestClient client = new RestClient
            {
                BaseUrl = new Uri(_emailSettings.ApiBaseUri),
                Authenticator = new HttpBasicAuthenticator("api", _emailSettings.ApiKey)
            };
            RestRequest request = new RestRequest();
            request.AddParameter("domain", _emailSettings.Domain, ParameterType.UrlSegment);
            request.Resource = "{domain}/messages";
            request.AddParameter("from", _emailSettings.From);
            request.AddParameter("to", to);
            request.AddParameter("subject", subject);
            request.AddParameter("html", body);
            request.Method = Method.POST;

            TaskCompletionSource<IRestResponse> taskCompletion = new TaskCompletionSource<IRestResponse>();

            client.ExecuteAsync(
                request, r => taskCompletion.SetResult(r));

            RestResponse response = (RestResponse)(await taskCompletion.Task);

            return response;
        }

        public async Task<IRestResponse> SendByMailGun(Dictionary<string, object> vars, string subject, string body)
        {
            RestClient client = new RestClient
            {
                BaseUrl = new Uri(_emailSettings.ApiBaseUri),
                Authenticator = new HttpBasicAuthenticator("api", _emailSettings.ApiKey)
            };
            RestRequest request = new RestRequest();
            request.AddParameter("domain", _emailSettings.Domain, ParameterType.UrlSegment);
            request.Resource = "{domain}/messages";
            request.AddParameter("from", _emailSettings.From);
            foreach (KeyValuePair<string, object> entry in vars)
            {
                request.AddParameter("to", entry.Key);
            }

            request.AddParameter("subject", subject);
            request.AddParameter("html", body);
            request.AddParameter("recipient-variables", JsonConvert.SerializeObject(vars));
            request.Method = Method.POST;
            TaskCompletionSource<IRestResponse> taskCompletion = new TaskCompletionSource<IRestResponse>();

            client.ExecuteAsync(
                request, r => taskCompletion.SetResult(r));

            RestResponse response = (RestResponse)(await taskCompletion.Task);

            return response;
        }

        public string GetTemplate(string tofullName, string content)
        {
            string folder = _hostingEnv.WebRootPath + @"\emails\EmailNotification.html";            

            using (StreamReader sr = File.OpenText(folder ?? throw new InvalidOperationException()))
            {
                string sb = sr.ReadToEnd();
                sr.Close();
                sb = sb.Replace("#CONTENT#", content);
                sb = sb.Replace("#SITENAME#", _configuration[CommonConstants.AppSettings.SystemName]);
                sb = sb.Replace("#SITEURL#", _configuration[CommonConstants.AppSettings.PortalUrl]);
                if (!string.IsNullOrEmpty(tofullName))
                {
                    tofullName = $"<p>{tofullName},</p>";
                    sb = sb.Replace("#TO#", tofullName);
                }

                return sb;
            }
        }
    }
}