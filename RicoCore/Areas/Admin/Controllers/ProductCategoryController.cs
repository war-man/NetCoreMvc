using Microsoft.AspNetCore.Mvc;
using RicoCore.Services.ECommerce.ProductCategories;
using RicoCore.Services.ECommerce.ProductCategories.Dtos;
using RicoCore.Services.ECommerce.Products;
using System;
using System.Linq;
using System.Collections.Generic;

namespace RicoCore.Areas.Admin.Controllers
{
    public class ProductCategoryController : BaseController
    {
        private IProductCategoryService _productCategoryService;
        private IProductService _productService;

        public ProductCategoryController(IProductCategoryService productCategoryService, IProductService productService)
        {
            _productCategoryService = productCategoryService;
            _productService = productService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region Get Data API

        [HttpGet]
        public IActionResult GetAll()
        {
            //var model = new ProductCategoryListViewModel();
            //model.ProductCategories =_productCategoryService.GetAll();
            //model.SetOrder = _productCategoryService.SetNewOrder();
            var model = _productCategoryService.GetAll();
            return new OkObjectResult(model);
        }

        

       

        [HttpGet]
        public IActionResult GetById(int id)
        {
            var model = _productCategoryService.GetById(id);

            return new ObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetNameById(int id)
        {
            var name = _productCategoryService.GetNameById(id);
            return Json(new
            {
                name
            });
        }



        public IActionResult PrepareSetNewProductCategory(int parentId)
        {
            var model = _productCategoryService.SetValueToNewProductCategory(parentId);
            return Json(new
            {
                parentId = model.ParentId,
                parentName = model.ParentProductCategoryName,
                sortOrder = model.SortOrder,
                homeOrder = model.HomeOrder,
                hotOrder = model.HotOrder
                //order = model.Order
            });
        }        
        [HttpPost]
        public IActionResult SaveEntity(ProductCategoryViewModel postCategoryVm)
        {
            try
            {
                if (postCategoryVm.Id == 0)
                {
                    var errorByProductItemName = "Tên danh mục sản phẩm đã tồn tại";
                    if (_productCategoryService.ValidateAddProductCategoryName(postCategoryVm))
                        ModelState.AddModelError("",
                           errorByProductItemName);

                    if (_productCategoryService.ValidateAddProductCategoryOrder(postCategoryVm))
                        ModelState.AddModelError("",
                            "Thứ tự đã tồn tại");

                    if (_productCategoryService.ValidateAddProductCategoryHomeOrder(postCategoryVm))
                        ModelState.AddModelError("",
                            "Thứ tự trang chủ đã tồn tại");

                    if (_productCategoryService.ValidateAddProductCategoryHotOrder(postCategoryVm))
                        ModelState.AddModelError("",
                            "Thứ tự khu vực HOT đã tồn tại");

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _productCategoryService.Add(postCategoryVm);
                }
                else
                {
                    var errorByProductItemName = "Tên danh mục sản phẩm đã tồn tại";
                    if (_productCategoryService.ValidateUpdateProductCategoryName(postCategoryVm))
                        ModelState.AddModelError("",
                           errorByProductItemName);

                    if (_productCategoryService.ValidateUpdateProductCategoryOrder(postCategoryVm))
                        ModelState.AddModelError("",
                            "Thứ tự đã tồn tại");

                    if (_productCategoryService.ValidateUpdateProductCategoryHomeOrder(postCategoryVm))
                        ModelState.AddModelError("",
                            "Thứ tự trang chủ đã tồn tại");

                    if (_productCategoryService.ValidateUpdateProductCategoryHotOrder(postCategoryVm))
                        ModelState.AddModelError("",
                            "Thứ tự khu vực HOT đã tồn tại");

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _productCategoryService.Update(postCategoryVm);
                }

                //if (!ModelState.IsValid)
                //{
                //        IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                //        return new BadRequestObjectResult(allErrors);
                //}

                _productCategoryService.Save();
                return new OkObjectResult(postCategoryVm);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpPost]
        public IActionResult UpdateParentId(int sourceId, int targetId, Dictionary<int, int> items)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                if (sourceId == targetId)
                {
                    return new BadRequestResult();
                }
                else
                {
                    _productCategoryService.UpdateParentId(sourceId, targetId, items);
                    _productCategoryService.Save();
                    return new OkResult();
                }
            }
        }

        [HttpPost]
        public IActionResult ReOrder(int sourceId, int targetId)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                if (sourceId == targetId)
                {
                    return new BadRequestResult();
                }
                else
                {
                    _productCategoryService.ReOrder(sourceId, targetId);
                    _productCategoryService.Save();
                    return new OkResult();
                }
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
                var subListL2 = _productCategoryService.AllSubCategories(id);
                if (subListL2 != null)
                {
                    foreach (var itemL2 in subListL2)
                    {
                        var subListL3 = _productCategoryService.AllSubCategories(itemL2.Id);
                        if (subListL3 != null)
                        {
                            foreach (var itemL3 in subListL3)
                            {
                                var subListL4 = _productCategoryService.AllSubCategories(itemL3.Id);
                                if (subListL4 != null)
                                {
                                    foreach (var itemL4 in subListL4)
                                    {
                                        var subListL5 = _productCategoryService.AllSubCategories(itemL4.Id);
                                        if (subListL5 != null)
                                        {
                                            foreach (var itemL5 in subListL5)
                                            {
                                                var subListL6 = _productCategoryService.AllSubCategories(itemL5.Id);
                                                if (subListL6 != null)
                                                {
                                                    foreach (var itemL6 in subListL6)
                                                    {
                                                        var lstIdL6 = _productService.GetIds(itemL6.Id);
                                                        _productService.MultiDelete(lstIdL6);
                                                        _productCategoryService.Delete(itemL6.Id);
                                                        _productService.Save();
                                                    }
                                                }
                                                var lstIdL5 = _productService.GetIds(itemL5.Id);
                                                _productService.MultiDelete(lstIdL5);
                                                _productCategoryService.Delete(itemL5.Id);
                                                _productService.Save();
                                            }
                                        }
                                        var lstIdL4 = _productService.GetIds(itemL4.Id);
                                        _productService.MultiDelete(lstIdL4);
                                        _productCategoryService.Delete(itemL4.Id);
                                        _productService.Save();
                                    }
                                }
                                var lstIdL3 = _productService.GetIds(itemL3.Id);
                                _productService.MultiDelete(lstIdL3);
                                _productCategoryService.Delete(itemL3.Id);
                                _productService.Save();
                            }
                        }
                        var lstIdL2 = _productService.GetIds(itemL2.Id);
                        _productService.MultiDelete(lstIdL2);
                        _productCategoryService.Delete(itemL2.Id);
                        _productService.Save();
                    }
                }
                var lstIdL1 = _productService.GetIds(id);
                _productService.MultiDelete(lstIdL1);
                _productService.Save();
                _productCategoryService.Delete(id);
                _productCategoryService.Save();
                return new OkObjectResult(id);
            }
        }
    }
}