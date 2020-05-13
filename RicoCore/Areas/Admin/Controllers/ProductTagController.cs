using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using RicoCore.Services.Content.Posts;
using RicoCore.Services.Content.Tags;
using RicoCore.Services.Content.Tags.Dtos;
using RicoCore.Services.ECommerce.Products;
using RicoCore.Utilities.Constants;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RicoCore.Areas.Admin.Controllers
{
    public class ProductTagController : BaseController
    {
        private readonly ITagService _tagService;
        private readonly IProductService _productService;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ProductTagController(ITagService tagService, IProductService productService, IHostingEnvironment hostingEnvironment)
        {
            _tagService = tagService;
            _productService = productService;
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region Get Data API

        [HttpGet]
        public IActionResult GetAllPaging(string keyword, int page, int pageSize, string sort)
        {
            var model = _tagService.GetProductTagAllPaging(keyword, page, pageSize, sort);
            return new OkObjectResult(model);
        }
       
        [HttpGet]
        public IActionResult GetById(string id)
        {
            var model = _tagService.GetById(id);
            return new ObjectResult(model);
        }


        [HttpGet]
        public IActionResult SetNewTagOrder()
        {
            var order = _tagService.SetNewTagOrder(out List<int> list, CommonConstants.ProductTag);
            return Json(new { order });
        }
        [HttpPost]
        public IActionResult SaveEntity(TagViewModel tagVm)
        {
            try
            {
                var productTag = CommonConstants.ProductTag;
                if (!_tagService.IsTagNameExists(tagVm.Name))
                {
                    if (_tagService.ValidateAddTagName(tagVm, productTag))
                        ModelState.AddModelError("",
                           "Tên tag đã tồn tại");

                    if (_tagService.ValidateAddTagOrder(tagVm, productTag))
                        ModelState.AddModelError("",
                            "Thứ tự đã tồn tại");

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);

                    _tagService.Add(tagVm, productTag);
                }
                else
                {
                    if (_tagService.ValidateUpdateTagName(tagVm, productTag))
                        ModelState.AddModelError("",
                           "Tên tag đã tồn tại");

                    if (_tagService.ValidateUpdateTagOrder(tagVm, productTag))
                        ModelState.AddModelError("",
                            "Thứ tự đã tồn tại");

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _tagService.Update(tagVm);
                }

                //if (!ModelState.IsValid)
                //{
                //        IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                //        return new BadRequestObjectResult(allErrors);
                //}

                _tagService.Save();
                return new OkObjectResult(tagVm);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion Get Data API

        [HttpPost]
        public IActionResult Delete(string id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                _tagService.Delete(id);
                _tagService.Save();
                return new OkObjectResult(id);
            }
        }

        [HttpPost]
        public IActionResult MultiDelete(ICollection<string> selectedIds)
        {
            if (selectedIds != null)
            {
                _tagService.MultiDelete(selectedIds.ToList());
            }
            return Json(new { Result = true });
        }
    }
}