using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Configuration;
using OfficeOpenXml;
using OfficeOpenXml.Table;
using RicoCore.Areas.Admin.Models;
using RicoCore.Data.Entities.System;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace RicoCore.Areas.Admin.Controllers
{
    public class AccountController : BaseController
    {
        private readonly SignInManager<AppUser> _signInManager;        
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;

        public AccountController(SignInManager<AppUser> signInManager, IHostingEnvironment hostingEnvironment, IConfiguration configuration
            )
        {
            _signInManager = signInManager;
            _hostingEnvironment = hostingEnvironment;
            _configuration = configuration;            
        }

        public IActionResult Index()
        {           
            return View();
        }             

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Redirect("/Admin/Login/Index");
        }       
      
    }
}