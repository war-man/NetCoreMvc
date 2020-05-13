using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RicoCore.Services.Systems.Permissions.Dtos;
using RicoCore.Services.Systems.Roles.Dtos;
using RicoCore.Data.Entities;
using RicoCore.Utilities.Dtos;
using RicoCore.Services.Systems.Announcements.Dtos;
using RicoCore.Data.Entities.System;

namespace RicoCore.Services.Systems.Roles
{
    public interface IRoleService 
    {        
        List<PermissionViewModel> GetListFunctionWithRole(Guid roleId);
        Task<bool> AddAsync(AnnouncementViewModel announcementVm, List<AnnouncementUserViewModel> announcementUsers, AppRoleViewModel userVm);       
        Task UpdateAsync(AppRoleViewModel userVm);
        Task<AppRoleViewModel> GetById(Guid id);
        Task SavePermission(List<PermissionViewModel> permissions, Guid roleId);
        Task<bool> CheckPermission(string functionCode, string action, string[] roles);
        Task<List<AppRole>> GetAllAsync(string exceptionSpecifiedRoles);
        Task<List<AppRoleViewModel>> GetAllAsync();




        PagedResult<AppRoleViewModel> GetAllPagingAsync(string keyword, int page, int pageSize);
        PagedResult<AppRoleViewModel> GetAllSoftDeletePagingAsync(string keyword, int page, int pageSize);




        Task MultiRecoverAsync(IList<string> selectedIds);
        Task MultiSoftDeleteAsync(IList<string> selectedIds);
        Task MultiDeleteAsync(IList<string> selectedIds);        
        Task RecoverAsync(Guid id);
        Task SoftDeleteAsync(Guid id);
        Task DeleteAsync(Guid id);        
    }
}
