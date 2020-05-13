using System.Collections.Generic;
using RicoCore.Data.Entities.Content;
using RicoCore.Services.Content.Contacts.Dtos;
using RicoCore.Services.Content.Footers.Dtos;
using RicoCore.Utilities.Dtos;

namespace RicoCore.Services.Content.Footers
{
    public interface IFooterService : IWebServiceBase<Footer, string, FooterViewModel>
    {
        #region GetAllPaging
        PagedResult<FooterViewModel> GetAllPaging(int page, int pageSize);
        #endregion
    }
}