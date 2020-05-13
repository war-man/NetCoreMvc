using System;
using RicoCore.Services.Content.PostCategories.Dtos;
using RicoCore.Data.Entities.Content;
using RicoCore.Utilities.Dtos;
using System.Collections.Generic;
using RicoCore.Services.Content.Posts.Dtos;

namespace RicoCore.Services.Content.PostCategories
{
    public interface IPostCategoryService : IWebServiceBase<PostCategory, int, PostCategoryViewModel>
    {
        //void Add(ProductCategoryViewModel productCategoryVm);
        //void Update(ProductCategoryViewModel productCategoryVm);
        //void Delete(Guid id);
        //ProductCategoryViewModel GetById(Guid id);
        //List<PostCategoryViewModel> GetAll();

        #region Validate Add
        bool ValidateAddPostCategoryName(PostCategoryViewModel postCategoryVm);
        bool ValidateAddPostCategoryOrder(PostCategoryViewModel productCategoryVm);
        bool ValidateAddPostCategoryHotOrder(PostCategoryViewModel productCategoryVm);
        bool ValidateAddPostCategoryHomeOrder(PostCategoryViewModel productCategoryVm);
        #endregion

        #region Validate Update
        bool ValidateUpdatePostCategoryName(PostCategoryViewModel postCategoryVm);
        bool ValidateUpdatePostCategoryOrder(PostCategoryViewModel productCategoryVm);
        bool ValidateUpdatePostCategoryHotOrder(PostCategoryViewModel productCategoryVm);
        bool ValidateUpdatePostCategoryHomeOrder(PostCategoryViewModel productCategoryVm);
        #endregion

        #region Set New Order
        int SetNewPostCategoryOrder(int? parentId);
        int SetNewPostCategoryHotOrder();
        int SetNewPostCategoryHomeOrder();
        #endregion

        #region Dropdownlist Categories
        void SetSelectListItemCategories(PostViewModel postVm, List<PostCategoryViewModel> postCategoriesVm);
        #endregion

        #region GetAllPaging
        PagedResult<PostCategoryViewModel> GetAllPaging(string keyword, int page, int pageSize);
        PagedResult<PostCategoryViewModel> GetAllPagingAsync(string keyword, int page, int pageSize);
        #endregion

        
        PostCategoryViewModel SetValueToNewPostCategory(int parentId);
        

        string GetNameById(int parentId);        
      

        List<PostCategoryViewModel> GetAll(string keyword);
        List<PostCategoryViewModel> GetCategoriesList();

        List<PostCategoryViewModel> GetAllByParentId(int? parentId);
        
        List<PostCategoryViewModel> GetHomeCategories(int top);

        void UpdateParentId(int sourceId, int targetId, Dictionary<int, int> items);

        void ReOrder(int sourceId, int targetId);
        List<PostCategory> AllSubCategories(int id);
        bool HasExistsCode(string code);
        PostCategoryViewModel GetByUrl(string url);
    }
}