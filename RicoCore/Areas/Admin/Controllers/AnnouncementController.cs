using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RicoCore.Extensions;
using RicoCore.Services.Systems.Announcements;
using Microsoft.AspNetCore.Mvc;

namespace RicoCore.Areas.Admin.Controllers
{
    public class AnnouncementController : BaseController
    {
        private readonly IAnnouncementService _announcementService;
        public AnnouncementController(IAnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllPaging(int page, int pageSize)
        {
            try
            {
                var model = _announcementService.GetAllUnReadPaging(User.GetUserId(), page, pageSize);
                return new OkObjectResult(model);               
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        public IActionResult MarkAsRead(Guid id)
        {
            var result = _announcementService.MarkAsRead(User.GetUserId(), id);
            return new OkObjectResult(result);
        }
    }
}