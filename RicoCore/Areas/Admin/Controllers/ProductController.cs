using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Table;
using RicoCore.Services.Content.PostCategories;
using RicoCore.Services.Content.PostCategories.Dtos;
using RicoCore.Services.Content.Posts;
using RicoCore.Services.Content.Posts.Dtos;
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
    public class ProductController : BaseController
    {
        private readonly IProductCategoryService _productCategoryService;
        private readonly IProductService _productService;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ProductController(IProductCategoryService productCategoryService, IProductService productService, IHostingEnvironment hostingEnvironment)
        {
            _productCategoryService = productCategoryService;
            _productService = productService;
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }
        
        

        #region Get Data API

        public IActionResult GetAll()
        {
            try
            {
                var model = _productService.GetAll();
                return new OkObjectResult(model);
            }
            catch (Exception ex)
            {

                throw ex;
            }            
        }
        [HttpPost]
        public IActionResult SaveWholePrice(Guid productId, List<WholePriceViewModel> wholePrices)
        {
            _productService.AddWholePrice(productId, wholePrices);
            _productService.Save();
            return new OkObjectResult(wholePrices);
        }

        [HttpGet]
        public IActionResult GetWholePrices(Guid productId)
        {
            var wholePrices = _productService.GetWholePrices(productId);
            return new OkObjectResult(wholePrices);
        }
        [HttpGet]
        public IActionResult GetAllPaging(int categoryId, string keyword, int page, int pageSize, string sort)
        {
            var model = _productService.GetAllPaging(categoryId, keyword, page, pageSize, sort);
            return new OkObjectResult(model);
        }

             

        [HttpGet]
        public IActionResult GetById(Guid id)
        {
            var model = _productService.GetById(id);

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



        public IActionResult PrepareSetNewProduct(int productCategoryId)
        {
            var model = _productService.SetValueToNewProduct(productCategoryId);
            return Json(new
            {
                productCategoryId = model.CategoryId,
                productCategoryName = model.CategoryName,
                order = model.SortOrder,
                homeOrder = model.HomeOrder,
                hotOrder = model.HotOrder
            });
        }               
        [HttpPost]
        public IActionResult SaveEntity(ProductViewModel productVm, string oldTags)
        {
            try
            {
                if (productVm.Id.ToString() == CommonConstants.DefaultGuid)
                {
                    var errorByProductItemName = "Tên sản phẩm đã tồn tại";
                    if (_productService.ValidateAddProductName(productVm))
                        ModelState.AddModelError("",
                           errorByProductItemName);

                    if (_productService.ValidateAddProductOrder(productVm))
                        ModelState.AddModelError("",
                            "Thứ tự đã tồn tại");

                    if (_productService.ValidateAddProductHotOrder(productVm))
                        ModelState.AddModelError("",
                            "Thứ tự khu vực HOT đã tồn tại");

                    if (_productService.ValidateAddProductHomeOrder(productVm))
                        ModelState.AddModelError("",
                            "Thứ tự trang chủ đã tồn tại");

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _productService.Add(productVm);
                }
                else
                {
                    var errorByProductItemName = "Tên sản phẩm đã tồn tại";
                    if (_productService.ValidateUpdateProductName(productVm))
                        ModelState.AddModelError("",
                           errorByProductItemName);

                    if (_productService.ValidateUpdateProductOrder(productVm))
                        ModelState.AddModelError("",
                            "Thứ tự đã tồn tại");

                    if (_productService.ValidateUpdateProductHotOrder(productVm))
                        ModelState.AddModelError("",
                            "Thứ tự khu vực HOT đã tồn tại");

                    if (_productService.ValidateUpdateProductHomeOrder(productVm))
                        ModelState.AddModelError("",
                            "Thứ tự trang chủ đã tồn tại");

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _productService.Update(productVm, oldTags);
                }

                //if (!ModelState.IsValid)
                //{
                //        IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                //        return new BadRequestObjectResult(allErrors);
                //}

                _productService.Save();
                return new OkObjectResult(productVm);
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

        [HttpGet]
        public IActionResult GetQuantities(Guid productId)
        {
            var quantities = _productService.GetQuantities(productId);
            return new OkObjectResult(quantities);
        }

        #endregion Get Data API

        [HttpPost]
        public IActionResult Delete(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                _productService.Delete(id);              
                _productService.Save();
                return new OkObjectResult(id);
            }
        }

        [HttpPost]
        public IActionResult SaveImages(Guid productId, string[] images)
        {
            _productService.AddImages(productId, images);
            _productService.Save();
            return new OkObjectResult(images);
        }

        [HttpGet]
        public IActionResult GetImages(Guid postId)
        {
            var images = _productService.GetImages(postId);
            return new OkObjectResult(images);
        }

        [HttpPost]
        public IActionResult MultiDelete(ICollection<string> selectedIds)
        {
            if (selectedIds != null)
            {
                _productService.MultiDelete(selectedIds.ToList());
            }
            return Json(new { Result = true });
        }

        [HttpPost]
        public IActionResult ImportExcel(IList<IFormFile> files, int categoryId)
        {
            if (files != null && files.Count > 0)
            {
                var file = files[0];
                var filename = ContentDispositionHeaderValue
                                   .Parse(file.ContentDisposition)
                                   .FileName
                                   .Trim('"');

                string folder = _hostingEnvironment.WebRootPath + $@"\uploaded\excels";
                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
                string filePath = Path.Combine(folder, filename);

                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }
                _productService.ImportExcel(filePath, categoryId);
                _productService.Save();
                return new OkObjectResult(filePath);
            }
            return new NoContentResult();
        }

        [HttpPost]
        public IActionResult SaveQuantities(Guid productId, List<ProductQuantityViewModel> quantities)
        {
            _productService.AddQuantity(productId, quantities);
            _productService.Save();
            return new OkObjectResult(quantities);
        }

        [HttpPost]
        public IActionResult ExportExcel()
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string directory = Path.Combine(sWebRootFolder, "export-files");
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
            string sFileName = $"Product_{DateTime.Now:yyyyMMddhhmmss}.xlsx";
            string fileUrl = $"{Request.Scheme}://{Request.Host}/export-files/{sFileName}";
            FileInfo file = new FileInfo(Path.Combine(directory, sFileName));
            if (file.Exists)
            {
                file.Delete();
                file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            }
            var products = _productService.GetAll();
            using (ExcelPackage package = new ExcelPackage(file))
            {
                // add a new worksheet to the empty workbook
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Products");
                worksheet.Cells["A1"].LoadFromCollection(products, true, TableStyles.Light1);
                worksheet.Cells.AutoFitColumns();
                package.Save(); //Save the workbook.
            }
            return new OkObjectResult(fileUrl);
        }
    }
}