using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using OfficeOpenXml;
using OfficeOpenXml.Table;
using RicoCore.Models;
using RicoCore.Models.ProductViewModels;
using RicoCore.Services.Content.PostCategories;
using RicoCore.Services.Content.PostCategories.Dtos;
using RicoCore.Services.Content.Posts;
using RicoCore.Services.Content.Posts.Dtos;
using RicoCore.Services.Content.Slides;
using RicoCore.Services.Content.Slides.Dtos;
using RicoCore.Services.ECommerce.ProductCategories;
using RicoCore.Services.ECommerce.ProductCategories.Dtos;
using RicoCore.Services.ECommerce.Products;
using RicoCore.Services.ECommerce.Products.Dtos;
using RicoCore.Services.Systems.Logos;
using RicoCore.Services.Systems.Logos.Dtos;
using RicoCore.Utilities.Constants;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;

namespace RicoCore.Areas.Admin.Controllers
{
    public class LogoController : BaseController
    {
        private readonly ILogoService _logoService;       
        private readonly IHostingEnvironment _hostingEnvironment;

        public LogoController(ILogoService logoService, IHostingEnvironment hostingEnvironment)
        {
            _logoService = logoService;
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }
       
        [HttpPost]
        public IActionResult GetAllPaging(int page, int pageSize)
        {
            var sortBy = string.Empty;
            //var productCategoryId = int.Parse(productCategoryIdStr);           
            var model = _logoService.GetAllPaging(page, pageSize, sortBy);
            return new OkObjectResult(model);
        }     

        #region Get Data API

        public IActionResult GetAll()
        {
            try
            {
                var model = _logoService.GetAll();
                return new OkObjectResult(model);
            }
            catch (Exception ex)
            {

                throw ex;
            }            
        }
    
        [HttpGet]
        public IActionResult GetById(int id)
        {
            var model = _logoService.GetById(id);
            return new ObjectResult(model);
        }


        [HttpPost]
        public IActionResult SetOrder()
        {           
            var order = _logoService.SetNewOrder();
            return Json(new
            {
                order
            });
        }
        [HttpPost]
        public IActionResult SaveEntity(LogoViewModel logoVm)
        {
            try
            {
                if (logoVm.Id == 0)
                {                                     
                    var errorBySortOrder = "Thứ tự đã tồn tại";
                    if (_logoService.ValidateAddSortOrder(logoVm))
                        ModelState.AddModelError("",
                           errorBySortOrder);
                   
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _logoService.Add(logoVm);
                }
                else
                {                  
                  
                    var errorBySortOrder = "Thứ tự đã tồn tại";
                    if (_logoService.ValidateUpdateSortOrder(logoVm))
                        ModelState.AddModelError("",
                           errorBySortOrder);

                    if (!ModelState.IsValid)
                    return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                        .ErrorMessage);

                    _logoService.Update(logoVm);
                }

                //if (!ModelState.IsValid)
                //{
                //    IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                //    return new BadRequestObjectResult(allErrors);
                //}

                _logoService.Save();
                return new OkObjectResult(logoVm);
                
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

      

        #endregion Get Data API

        [HttpPost]
        public IActionResult Delete(int id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                _logoService.Delete(id);              
                _logoService.Save();
                return new OkObjectResult(id);
            }
        }

     

        [HttpPost]
        public IActionResult MultiDelete(ICollection<string> selectedIds)
        {
            try
            {
                if (selectedIds != null)
                {
                    _logoService.MultiDelete(selectedIds.ToList());
                    _logoService.Save();
                }
                return new OkResult();
            }
            catch (Exception ex)
            {
                throw ex;               
            }
          
        }               
    }
}