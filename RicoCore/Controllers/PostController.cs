using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RicoCore.Models;
using RicoCore.Services.Content.PostCategories;
using RicoCore.Services.Content.Posts;
using System;

namespace RicoCore.Controllers
{
    public class PostController : Controller
    {
        private readonly IPostCategoryService _postCategoryService;
        private readonly IPostService _postService;
        private readonly IConfiguration _configuration;

        public PostController(IPostCategoryService postCategoryService, IPostService postService, IConfiguration configuration)
        {
            _postCategoryService = postCategoryService;
            _postService = postService;
            _configuration = configuration;
        }

        [Route("danh-muc/{url}")]
        public IActionResult Index(string url, int? pageSize, string sortBy, int trang = 1)
        {
            var catalog = new PostListByCategoryViewModel();
            if (pageSize == null)
                pageSize = _configuration.GetValue<int>("PageSize");

            //pageSize = 10;
            catalog.PageSize = pageSize;
            catalog.SortType = sortBy;

            var category = _postCategoryService.GetByUrl(url);
            var categoryId = category.Id;
            //ViewBag.CategoryName = category.Name;
            //ViewBag.MetaTitle = category.MetaTitle;
            //ViewBag.MetaDescription = category.MetaDescription;
            //ViewBag.MetaKeywords = category.MetaKeywords;
            //ViewBag.Url = category.Url;
            //var list = _postService.GetAllByCategoryId(categoryId);

            catalog.Data = _postService.GetAllPaging(categoryId, string.Empty, trang, pageSize.Value);
            catalog.Category = category;
            return View(catalog);
        }

        [Route("bai-viet/{url}")]
        public IActionResult Detail(string url)
        {
            var post = _postService.GetByUrl(url);
            if (post == null) throw new Exception("Null");
            var postCategoryId = post.CategoryId;

            var category = _postCategoryService.GetById(postCategoryId);
            if (category == null) throw new Exception("Null");
            var categoryId = category.Id;
            ViewBag.CategoryName = category.Name;
            ViewBag.CategoryMetaTile = category.MetaTitle;
            ViewBag.CategoryUrl = category.Url;

            ViewBag.MetaTitle = post.MetaTitle;
            ViewBag.MetaDescription = post.MetaDescription;
            ViewBag.MetaKeywords = post.MetaKeywords;
            return View(post);
        }
    }
}