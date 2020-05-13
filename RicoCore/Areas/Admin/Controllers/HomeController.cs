﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RicoCore.Extensions;

namespace RicoCore.Areas.Admin.Controllers
{
    [Authorize]
    [Area("Admin")]
    public class HomeController : BaseController
    {
        public IActionResult Index()
        {       
            var email = User.GetSpecificClaim("Email");
            return View();
        }

        public IActionResult AccessDeny()
        {           
            return View();
        }
    }
}