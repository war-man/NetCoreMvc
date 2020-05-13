using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RicoCore.Models;
using RicoCore.Services;
using RicoCore.Services.Content.Contacts;
using RicoCore.Services.Content.Feedbacks;
using RicoCore.Utilities.Constants;

namespace RicoCore.Controllers
{
    public class ContactController : Controller
    {
        private readonly IContactService _contactService;
        private readonly IFeedbackService _feedbackService;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;
        private readonly IViewRenderService _viewRenderService;

        public ContactController(IContactService contactSerivce,
            IViewRenderService viewRenderService,
            IConfiguration configuration,
            IEmailSender emailSender, IFeedbackService feedbackService)
        {
            _contactService = contactSerivce;
            _feedbackService = feedbackService;
            _emailSender = emailSender;
            _configuration = configuration;
            _viewRenderService = viewRenderService;
        }

        [Route("lien-he")]
        [HttpGet]
        public IActionResult Index()
        {
            ViewData["BodyClass"] = "contact-page";
            var contact = _contactService.GetById(1);
            var model = new ContactPageViewModel { ContactDetail = contact };
            return View(model);
        }

        [Route("lien-he")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public async Task<IActionResult> Index(ContactPageViewModel model)
        {
            if (ModelState.IsValid)
            {
                _feedbackService.Add(model.Feedback);
                _feedbackService.Save();
                var content = await _viewRenderService.RenderToStringAsync("Contact/_ContactMail", model.Feedback);
                await _emailSender.SendEmailAsync(_configuration["MailSettings:AdminMail"], "Có phản hồi mới", content);
                ViewData["Success"] = true;
            }

            model.ContactDetail = _contactService.GetById(1);

            return View("Index", model);
        }

    }
}