using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RicoCore.Services.ECommerce.ProductCategories;
using RestSharp;
using System.Net.Http;

namespace RicoCore.WebApi.Controllers
{   
    [Authorize]
    public class ProductController : ApiController
    {
        private readonly IProductCategoryService _productCategoryService;
       public ProductController(IProductCategoryService productCategoryService)
        {
            _productCategoryService = productCategoryService;
        }

        // GET: api/values
        [HttpGet]
        public IActionResult Get()
        {
            return new OkObjectResult(_productCategoryService.GetAll());
        }

        
    }
}
