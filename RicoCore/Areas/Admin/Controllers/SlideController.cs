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
using RicoCore.Utilities.Constants;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;

namespace RicoCore.Areas.Admin.Controllers
{
    public class SlideController : BaseController
    {
        private readonly ISlideService _slideService;       
        private readonly IHostingEnvironment _hostingEnvironment;

        public SlideController(ISlideService slideService, IHostingEnvironment hostingEnvironment)
        {
            _slideService = slideService;
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }
       
        [HttpPost]
        public IActionResult GetAllPaging(string keyword, string position, int page, int pageSize)
        {
            var sortBy = string.Empty;
            //var productCategoryId = int.Parse(productCategoryIdStr);           
            var model = _slideService.GetAllPaging(keyword, position, page, pageSize, sortBy);
            return new OkObjectResult(model);
        }     

        #region Get Data API

        public IActionResult GetAll()
        {
            try
            {
                var model = _slideService.GetAll();
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
            var model = _slideService.GetById(id);
            return new ObjectResult(model);
        }


        [HttpPost]
        public IActionResult SetOrder(int position)
        {           
            var order = _slideService.SetNewSlideOrder(position);
            return Json(new
            {
                order
            });
        }
        [HttpPost]
        public IActionResult SaveEntity(SlideViewModel slideVm, int position)
        {
            try
            {
                if (slideVm.Id == 0)
                {                    
                    var errorBySlideName = "Tên slide đã tồn tại";
                    if (_slideService.ValidateAddSlideName(slideVm))
                        ModelState.AddModelError("",
                           errorBySlideName);

                    var errorBySortOrder = "Thứ tự đã tồn tại";
                    if (_slideService.ValidateAddSortOrder(slideVm, position))
                        ModelState.AddModelError("",
                           errorBySortOrder);
                   
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _slideService.Add(slideVm);
                }
                else
                {                  
                    var errorBySlideName = "Tên slide đã tồn tại";
                    if (_slideService.ValidateUpdateSlideName(slideVm))
                        ModelState.AddModelError("",
                           errorBySlideName);

                    var errorBySortOrder = "Thứ tự đã tồn tại";
                    if (_slideService.ValidateUpdateSortOrder(slideVm, position))
                        ModelState.AddModelError("",
                           errorBySortOrder);

                    if (!ModelState.IsValid)
                    return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                        .ErrorMessage);

                    _slideService.Update(slideVm);
                }

                //if (!ModelState.IsValid)
                //{
                //    IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                //    return new BadRequestObjectResult(allErrors);
                //}

                _slideService.Save();
                return new OkObjectResult(slideVm);
                
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
                _slideService.Delete(id);              
                _slideService.Save();
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
                    _slideService.MultiDelete(selectedIds.ToList());
                    _slideService.Save();
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