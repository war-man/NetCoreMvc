using System.Collections.Generic;
using RicoCore.Data.Entities.Content;
using RicoCore.Services.Content.Contacts.Dtos;
using RicoCore.Utilities.Dtos;

namespace RicoCore.Services.Content.Contacts
{
    public interface IContactService : IWebServiceBase<ContactDetail, int, ContactDetailViewModel>
    {              
        #region Validate Add Contact
        bool ValidateAddContactDetailName(ContactDetailViewModel vm);
        #endregion

        #region Validate Update Contact
        bool ValidateUpdateContactDetailName(ContactDetailViewModel vm);
        #endregion

        #region MultiDelete
        void MultiDelete(IList<string> selectedIds);
        #endregion

        #region PageAllPaging
        PagedResult<ContactDetailViewModel> GetAllPaging(string keyword, int page, int pageSize);
        #endregion
    }
}