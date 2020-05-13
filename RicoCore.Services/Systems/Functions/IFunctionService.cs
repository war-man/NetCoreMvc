using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RicoCore.Services.Systems.Functions.Dtos;
using RicoCore.Data.Entities;
using RicoCore.Data.Entities.System;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace RicoCore.Services.Systems.Functions
{
    public interface IFunctionService : IWebServiceBase<Function, int, FunctionViewModel>
    {
        #region GetAll
        Task<List<FunctionViewModel>> GetAll(string filter);
        void UpdateParentId(int sourceId, int targetId, Dictionary<int, int> items);
        void ReOrder(int sourceId, int targetId);
        #endregion

        #region Dropdownlist Functions
        IList<SelectListItem> FunctionsSelectListItem(int id = 0);
        #endregion

        #region Add
        FunctionViewModel SetValueToNewFunction(int parentId);
        string GetNameById(int parentId);
        int SetNewOrder(int? parentId);
        bool ValidateAddOrder(FunctionViewModel menuVm);
        bool ValidateAddUniqueCode(FunctionViewModel menuVm);
        #endregion

        #region Update
        bool ValidateUpdateOrder(FunctionViewModel menuVm);
        bool ValidateUpdateUniqueCode(FunctionViewModel menuVm, string uniqueCode);
        #endregion

        #region Others   
        List<Function> AllSubCategories(int id);

        Task<List<FunctionViewModel>> GetAllWithPermission(string userName);

        List<FunctionViewModel> GetAllWithParentId(int? parentId);

        bool CheckExistedId(int id);

        #endregion

    }
}