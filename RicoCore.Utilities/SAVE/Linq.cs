using System;
using System.Collections.Generic;
using System.Text;

namespace RicoCore.Utilities.SAVE
{
    public class Linq
    {
        //var query = from pi in _productItemRepository.GetAll()
        //               .Where(x => x.Status == Status.Actived)
        //               .OrderByDescending(x => x.DateCreated)
        //               .Take(top)
        //            join p in _productRepository.GetAll()
        //            on pi.ProductId equals p.Id
        //            where pi.ProductId == p.Id
        //            select new ProductSingleViewModel
        //            {
        //                ProductItem = Mapper.Map<ProductItem, ProductItemViewModel>(pi),
        //                ProductUrl = p.Url
        //            };

        //var productlist = query.Select(x => new PostViewModel()
        //{
        //    Name = x.p.Name,
        //    //Id = x.p.Id,
        //    CategoryId = x.p.CategoryId,
        //    Url = x.p.Url,
        //    Description = x.p.Description,
        //    Image = x.p.Image,
        //    Content = x.p.Content,
        //    Viewed = x.p.Viewed,
        //    Tags = x.p.Tags,
        //    //Unit = x.p.Unit,
        //    HomeFlag = x.p.HomeFlag,
        //    HotFlag = x.p.HotFlag,
        //    //Quantity = x.p.Quantity,
        //    Status = x.p.Status,
        //    MetaTitle = x.p.MetaTitle,
        //    MetaDescription = x.p.MetaDescription,
        //    MetaKeywords = x.p.MetaKeywords
        //}).ToList();

        //    var query = (from p in _productRepository.GetAll()
        //                 join pt in _productTagRepository.GetAll() on p.Id equals pt.ProductId
        //                 join t in _tagRepository.GetAll() on pt.TagId equals t.Id
        //                 where p.Id == id && pt.ProductId == id
        //                 select new { p, pt, t }); // join product, producttag, tag

        //    var model = query.OrderByDescending(x => x.p.CreatedDate)
        //        .Select(x => new ProductViewModel()
        //        {
        //            Name = x.p.Name,
        //            Id = x.p.Id,
        //            CategoryId = x.p.CategoryId,
        //            CategoryName = x.pc.Name,
        //            Price = x.p.Price,
        //            ThumbnailImage = x.p.ThumbnailImage,
        //            DateCreated = x.p.DateCreated,
        //            Status = x.p.Status
        //        }).ToList();

        //    model.Colors = _billService.GetColors().Select(x => new SelectListItem()
        //    {
        //        Text = x.Name,
        //        Value = x.Id.ToString()
        //    }).ToList();
    }
}
