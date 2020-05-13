using Microsoft.AspNetCore.Mvc;
using RicoCore.Services.Systems.Functions;
using RicoCore.Services.Systems.Functions.Dtos;
using RicoCore.Utilities.Constants;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RicoCore.Areas.Admin.Components
{
    // ViewComponent
    // using Microsoft.AspNetCore.Mvc;
    public class TopControlViewComponent : ViewComponent
    {        
        // IViewComponentResult
        // using Microsoft.AspNetCore.Mvc;
        public async Task<IViewComponentResult> InvokeAsync(string function)
        {
            try
            {
                ViewBag.Function = function;
                return View();
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
           
        }
    }
}