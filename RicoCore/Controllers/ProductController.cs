using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using RicoCore.Data.Entities;
using RicoCore.Models.ProductViewModels;
using RicoCore.Services.ECommerce.Bills;
using RicoCore.Services.ECommerce.ProductCategories;
using RicoCore.Services.ECommerce.Products;
using RicoCore.Services.ECommerce.Products.Dtos;

namespace RicoCore.Controllers
{
    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        private readonly IBillService _billService;
        private readonly IProductCategoryService _productCategoryService;
        private readonly IProductColorService _productColorService;
        private readonly IColorService _colorService;
        private readonly IConfiguration _configuration;
        public ProductController(IProductService productService, IConfiguration configuration,
            IBillService billService,
            IProductColorService productColorService, 
            IColorService colorService,
            IProductCategoryService productCategoryService)
        {
            _colorService = colorService;
            _productColorService = productColorService;
            _productService = productService;
            _productCategoryService = productCategoryService;
            _configuration = configuration;
            _billService = billService;
        }

        
        public IActionResult Index()
        {
            ViewData["BodyClass"] = "category-page";
            var categories = _productCategoryService.GetAll();
            return View(categories);
        }


       

       

        #region Timkiem
        //[Route("tim-kiem")]
        //public IActionResult Search(string tukhoa, int? kickcopage, string sortBy, int page = 1)
        //{
        //    var catalog = new SearchResultViewModel();
        //    ViewData["BodyClass"] = "category-page";
        //    if (kickcopage == null)
        //        kickcopage = _configuration.GetValue<int>("ProductPageSize");

        //    catalog.PageSize = kickcopage;
        //    catalog.SortType = sortBy;
        //    catalog.Data = _productService.GetAllPaging(null, tukhoa, page, kickcopage.Value, sortBy);
        //    catalog.Keyword = tukhoa;

        //    return View(catalog);
        //}
        #endregion

        [Route("{url}.html")]
        public IActionResult List(string url, string keyword, int? pageSize, string sortBy, int trang = 1)
        {
            var catalog = new ListByCategoryViewModel();
            var listProductItemByCategory = string.Empty;
            ViewData["BodyClass"] = "category-page";
            if (pageSize == null)
                pageSize = _configuration.GetValue<int>("ProductPageSize");
            var category  = _productCategoryService.GetByUrl(url);                                    
            catalog.MetaTitle = category.MetaTitle;
            catalog.MetaKeywords = category.MetaKeywords;
            catalog.MetaDescription = category.MetaDescription;
            catalog.CategoryName = category.Name;
            catalog.CategoryUrl = category.Url;
            catalog.SortType = sortBy;
            catalog.Data = _productService.GetAllPaging(1, keyword, trang, pageSize.Value, sortBy);

            return View(catalog);
        }      

        [HttpGet]
        [Route("{productUrl}/mau-rem={url}", Name = "Detail")]
        public IActionResult Detail(string url, string productUrl)
        {
            try
            {
                ViewData["BodyClass"] = "single-product-page";               
                return View();
            }
            catch (Exception ex)
            {
                throw ex;
            }            
        }

        //[Route("as.ss.san-pham/{url}", Name = "ProductDetailsss")]
        //public IActionResult Detail(string url)
        //{
        //    ViewData["BodyClass"] = "single-product-page";

        //    var detail = new DetailViewModel();
        //    detail.Product = _productService.GetByUrl(url);
        //    var imgShow = _productService.GetDefaultImageForProductDetail(detail.Product.Id);
        //    detail.Product.Image = imgShow;
        //    var proId = detail.Product != null ? detail.Product.Id : Guid.NewGuid();
        //    detail.Category = _productCategoryService.GetById(detail.Product.CategoryId);
        //    detail.ProductItems = _productService.GetProductItemsByProductId(proId);
        //    detail.RelatedProducts = _productService.GetReatedProducts(proId, 4);
        //    detail.UpsellProducts = _productService.GetUpsellProducts(8);
        //    detail.ProductImages = _productService.GetImages(proId);
        //    detail.Tags = _productService.GetListTagByProductId(proId);
        //    detail.Colors = _billService.GetColors().Select(x => new SelectListItem()
        //    {
        //        Text = x.Name,
        //        Value = x.Id.ToString()
        //    }).ToList();
        //    return View(detail);
        //}

        //#region draft
        //[Route("{alias}-p.{id}.html", Name = "ProductDetail")]
        //public IActionResult Details(int id)
        //{
        //    ViewData["BodyClass"] = "product-page";
        //    var model = new DetailViewModel();
        //    model.Product = _productService.GetById(id);
        //    model.Category = _productCategoryService.GetById(model.Product.CategoryId);
        //    model.RelatedProducts = _productService.GetRelatedProducts(id, 9);
        //    model.UpsellProducts = _productService.GetUpsellProducts(6);
        //    model.ProductImages = _productService.GetImages(id);
        //    model.Tags = _productService.GetProductTags(id);
        //    model.Colors = _billService.GetColors().Select(x => new SelectListItem()
        //    {
        //        Text = x.Name,
        //        Value = x.Id.ToString()
        //    }).ToList();
        //    model.Sizes = _billService.GetSizes().Select(x => new SelectListItem()
        //    {
        //        Text = x.Name,
        //        Value = x.Id.ToString()
        //    }).ToList();

        //    return View(model);
        //}
        //#endregion
    }
}