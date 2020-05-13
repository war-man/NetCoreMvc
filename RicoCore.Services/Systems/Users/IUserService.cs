using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using RicoCore.Data.Entities.System;
using RicoCore.Services.Systems.Users.Dtos;
using RicoCore.Utilities.Dtos;

namespace RicoCore.Services.Systems.Users
{
    public interface IUserService
    {
        Task<bool> AddAsync(AppUserViewModel userVm);
        Task<AppUserViewModel> GetById(Guid id);
        Task UpdateAsync(AppUserViewModel userVm);        
        Task<bool> ChangePassword(AppUserViewModel userVm, string newpass);
        Task<IdentityResult> ChangePasswordAsync(AppUserViewModel userVm, string currentPassword, string newPassword);
        AppUser GetByEmail(string email);




        PagedResult<AppUserViewModel> GetAllPagingAsync(string keyword, int page, int pageSize);
        PagedResult<AppUserViewModel> GetAllSoftDeletePagingAsync(string keyword, int page, int pageSize);
        

        
        Task MultiRecoverAsync(IList<string> selectedIds);
        Task MultiSoftDeleteAsync(IList<string> selectedIds);
        Task MultiDeleteAsync(IList<string> selectedIds);
        void MultiDelete(IList<string> selectedIds);
        Task RecoverAsync(Guid id);
        Task SoftDeleteAsync(Guid id);
        Task DeleteAsync(Guid id);
    }
}
