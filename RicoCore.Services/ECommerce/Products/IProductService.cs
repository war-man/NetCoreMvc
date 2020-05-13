using RicoCore.Data.Entities.ECommerce;
using RicoCore.Services.Content.Tags.Dtos;
using RicoCore.Services.ECommerce.ProductCategories.Dtos;
using RicoCore.Services.ECommerce.Products.Dtos;
using RicoCore.Utilities.Dtos;
using System;
using System.Collections.Generic;

namespace RicoCore.Services.ECommerce.Products
{
    public interface IProductService : IWebServiceBase<Product, Guid, ProductViewModel>
    {
        //void Add(ProductViewModel productVm);
        //void Update(ProductViewModel productVm);
        //void Delete(Guid id);
        //ProductViewModel GetById(Guid id);
        //List<ProductViewModel> GetAll();
        //PagedResult<ProductViewModel> GetAllPaging(string keyword, int pageSize, int page = 1);

        #region Validate Add Product
        bool ValidateAddProductName(ProductViewModel productVm);
        bool ValidateAddProductOrder(ProductViewModel productVm);                
        bool ValidateAddProductHotOrder(ProductViewModel productVm);       
        bool ValidateAddProductHomeOrder(ProductViewModel productVm);       
        #endregion

        #region Validate Update Product
        bool ValidateUpdateProductName(ProductViewModel productVm);
        bool ValidateUpdateProductOrder(ProductViewModel productVm);        
        bool ValidateUpdateProductHotOrder(ProductViewModel productVm);               
        bool ValidateUpdateProductHomeOrder(ProductViewModel productVm);
        #endregion

        #region Set New Order
        ProductViewModel SetValueToNewProduct(int productCategoryId);
        int SetNewProductOrder(int categoryId);   
        int SetNewProductHotOrder();      
        int SetNewProductHomeOrder();
        #endregion

        #region Add Product

        #endregion

        #region Update Product
        void Update(ProductViewModel productVm, string oldTags);
        #endregion

        #region GetAllPaging
        PagedResult<ProductViewModel> GetAllPaging(int categoryId, string keyword, int page, int pageSize, string sortBy);
        PagedResult<ProductViewModel> GetAllPaging(int categoryId, string keyword, int page, int pageSize);
        
        PagedResult<ProductViewModel> GetAllPaging(int? categoryId, string keyword, int page, int pageSize, string sortBy);
        #endregion

        #region MultiDelete
        void MultiDelete(IList<string> selectedIds);
        #endregion

        #region Add Tags
        void CreateTagId(ref string tagId, ref List<string> listStr, ref List<int> listDuoi);
        void CreateTagAndProductTag(Product post, ProductViewModel postVm);
        int SetNewTagOrder(out List<int> list);
        #endregion

        #region WishLists
        PagedResult<ProductViewModel> GetMyWishlist(Guid userId, int page, int pageSize);
        #endregion

        #region Add Images
        void AddImages(Guid productId, string[] images);
        #endregion

        #region Import/Export Excel
        void ImportExcel(string filePath, int categoryId);
        #endregion


        List<TagViewModel> GetAllTags();

        List<ProductViewModel> GetListPaging(int page, int pageSize, string sort, out int totalRow);


        List<ColorViewModel> GetColors();
        string GetColor(int colorId);
        ProductViewModel GetByUrl(string url);       

        List<ProductViewModel> GetByCategoryId(int categoryId);
       
        
        
        List<Product> GetProductsByTagName(string tagName);
              

        List<ProductViewModel> GetListProductByCategoryIdPaging(int categoryId, int page, int pageSize, string sort, out int totalRow);
        List<ProductViewModel> GetListProductByCategoryId(int categoryId);
        List<ProductViewModel> GetListProduct(string keyword);

        List<ProductViewModel> GetListProductByTag(string tagId, int page, int pagesize, out int totalRow);             

        List<ProductViewModel> GetReatedProducts(Guid id, int top);        
        List<ProductViewModel> GetUpsellProducts(int top);
     
        List<ProductViewModel> Search(string keyword, int page, int pageSize, string sort, out int totalRow);

        List<TagViewModel> GetListTagByProductId(Guid id);
        TagViewModel GetTagByUrl(string url);
        List<TagViewModel> GetListProductTag(string searchText);

        TagViewModel GetTag(string tagId);

        List<ProductImageViewModel> GetImages(Guid productId);
        
        List<WholePriceViewModel> GetWholePrices(Guid productId);

        void AddWholePrice(Guid productId, List<WholePriceViewModel> wholePrices);

        void AddQuantity(Guid productId, List<ProductQuantityViewModel> quantities);

        List<ProductQuantityViewModel> GetQuantities(Guid productId);

        List<string> GetListProductByName(string name);

        void IncreaseView(Guid id);
       
       
        IList<string> GetIds(int categoryId);
        bool HasExistsProductCode(string code);              
    }
}