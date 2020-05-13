using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RicoCore.Services.Systems.Permissions.Dtos;
using RicoCore.Services.Systems.Roles.Dtos;
using RicoCore.Data.Entities;
using RicoCore.Infrastructure.Interfaces;
using RicoCore.Utilities.Dtos;
using RicoCore.Data.Entities.System;
using RicoCore.Services.Systems.Announcements.Dtos;
using RicoCore.Data.Entities.ECommerce;
using RicoCore.Data.EF;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace RicoCore.Services.Systems.Roles
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IRepository<Function, int> _functionRepository;
        private readonly IRepository<Permission, int> _permissionRepository;
        private readonly IRepository<Announcement, Guid> _announRepository;
        private readonly IRepository<AnnouncementUser, Guid> _announUserRepository;        
        private readonly IUnitOfWork _unitOfWork;
        private readonly DbSet<AppRole> AppRoles;

        public RoleService(RoleManager<AppRole> roleManager,
            IRepository<Function, int> functionRepository,
            IRepository<Permission, int> permissionRepository,
            IRepository<Announcement, Guid> announRepository,
            IRepository<AnnouncementUser, Guid> announUserRepository,
            IUnitOfWork unitOfWork,
            AppDbContext context)
        {
            _roleManager = roleManager;
            _functionRepository = functionRepository;
            _permissionRepository = permissionRepository;
            _announRepository = announRepository;
            _unitOfWork = unitOfWork;
            _announUserRepository = announUserRepository;
            AppRoles = context.Set<AppRole>();
        }

        

        public List<PermissionViewModel> GetListFunctionWithRole(Guid roleId)
        {
            var functions = _functionRepository.GetAll();
            var permissions = _permissionRepository.GetAll();

            var query = from f in functions
                        join p in permissions on f.Id equals p.FunctionId into fp
                        from p in fp.DefaultIfEmpty()
                        where p != null && p.RoleId == roleId
                        select new PermissionViewModel()
                        {
                            RoleId = roleId,
                            FunctionId = f.Id,
                            CanCreate = p != null ? p.CanCreate : false,
                            CanSoftDelete = p != null ? p.CanSoftDelete : false,
                            CanDelete = p != null ? p.CanDelete : false,
                            CanRead = p != null ? p.CanRead : false,
                            CanUpdate = p != null ? p.CanUpdate : false
                        };
            return query.ToList();
        }
        
        public async Task<bool> AddAsync(AnnouncementViewModel announcementVm, List<AnnouncementUserViewModel> announcementUsers, AppRoleViewModel roleVm)
        {
            var role = new AppRole()
            {
                //Id = Guid.NewGuid(),
                Name = roleVm.Name,
                Description = roleVm.Description,
                DateCreated = DateTime.Now
            };
            var result = await _roleManager.CreateAsync(role);
            announcementVm.Content = result.Succeeded ? $"Quyền {roleVm.Name} đã được tạo" : $"Quyền {roleVm.Name} tạo không thành công";
            var announcement = Mapper.Map<AnnouncementViewModel, Announcement>(announcementVm);
            _announRepository.Insert(announcement);
            foreach (var userVm in announcementUsers)
            {
                var user = Mapper.Map<AnnouncementUserViewModel, AnnouncementUser>(userVm);
                _announUserRepository.Insert(user);
            }
            _unitOfWork.Commit();
            return result.Succeeded;
        }     

        public async Task UpdateAsync(AppRoleViewModel roleVm)
        {            
            var role = await _roleManager.FindByIdAsync(roleVm.Id.ToString());
            role.Description = roleVm.Description;
            role.Name = roleVm.Name;
            role.DateModified = DateTime.Now;
            await _roleManager.UpdateAsync(role);
        }

        public async Task<AppRoleViewModel> GetById(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            return Mapper.Map<AppRole, AppRoleViewModel>(role);
        }

        public async Task SavePermission(List<PermissionViewModel> permissionVms, Guid roleId)
        {
            var permissions = Mapper.Map<List<PermissionViewModel>, List<Permission>>(permissionVms);
            var oldPermission = _permissionRepository.GetAll().ToList();
            if (oldPermission.Count > 0)
            {
                _permissionRepository.Delete(x => x.RoleId == roleId);
            }
            //await _unitOfWork.CommitAsync();
            foreach (var permission in permissions)
            {
                _permissionRepository.Insert(permission);
            }
            await _unitOfWork.CommitAsync();
        }

        public Task<bool> CheckPermission(string functionCode, string action, string[] roles)
        {
            var functions = _functionRepository.GetAll();
            var permissions = _permissionRepository.GetAll();
            var query = from f in functions
                        join p in permissions on f.Id equals p.FunctionId
                        join r in _roleManager.Roles on p.RoleId equals r.Id
                        where roles.Contains(r.Name) && f.UniqueCode == functionCode
                        && ((p.CanCreate && action == "Create")
                        || (p.CanUpdate && action == "Update")
                        || (p.CanSoftDelete && action == "SoftDelete")
                        || (p.CanDelete && action == "Delete")
                        || (p.CanRead && action == "Read"))
                        select p;
            return query.AnyAsync();
        }

        public async Task<List<AppRole>> GetAllAsync(string exceptions)
        {
            //var list = new List<AppRoleViewModel>();
            //var exceptRole = _roleManager.FindByNameAsync("rico").Result;
            //var exceptRoleVm = Mapper.Map<AppRole, AppRoleViewModel>(exceptRole);
            //list.Add(exceptRoleVm);
            var list = new List<AppRole>();
            var target = _roleManager.FindByNameAsync("rico").Result;
            list.Add(target);
            return await _roleManager.Roles.Except(list).ToListAsync();
        }

        public async Task<List<AppRoleViewModel>> GetAllAsync()
        {
            //var list = new List<AppRoleViewModel>();
            //var exceptRole = _roleManager.FindByNameAsync("rico").Result;
            //var exceptRoleVm = Mapper.Map<AppRole, AppRoleViewModel>(exceptRole);
            //list.Add(exceptRoleVm);
            var list = new List<AppRole>();
            var target = _roleManager.FindByNameAsync("rico").Result;
            list.Add(target);
            var query = _roleManager.Roles.Except(list);
            var result = await query.ProjectTo<AppRoleViewModel>().ToListAsync();
            return result;
        }




        public PagedResult<AppRoleViewModel> GetAllPagingAsync(string keyword, int page, int pageSize)
        {
            var list = new List<AppRole>();
            var target = _roleManager.FindByNameAsync("rico").Result;
            list.Add(target);
            var query = _roleManager.Roles.Except(list).Where(x => x.DateDeleted == null);
            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.Name.Contains(keyword)
                || x.Description.Contains(keyword));

            int totalRow = query.Count();
            query = query.Skip((page - 1) * pageSize)
               .Take(pageSize);

            var data = query.ProjectTo<AppRoleViewModel>().ToList();
            var paginationSet = new PagedResult<AppRoleViewModel>()
            {
                Results = data,
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };
            return paginationSet;
        }

        public PagedResult<AppRoleViewModel> GetAllSoftDeletePagingAsync(string keyword, int page, int pageSize)
        {
            var list = new List<AppRole>();
            var target = _roleManager.FindByNameAsync("rico").Result;
            list.Add(target);
            var query = _roleManager.Roles.Except(list).Where(x => x.DateDeleted != null);
            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.Name.Contains(keyword)
                || x.Description.Contains(keyword));

            int totalRow = query.Count();
            query = query.Skip((page - 1) * pageSize)
               .Take(pageSize);

            var data = query.ProjectTo<AppRoleViewModel>().ToList();
            var paginationSet = new PagedResult<AppRoleViewModel>()
            {
                Results = data,
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };
            return paginationSet;
        }




        public async Task MultiRecoverAsync(IList<string> selectedIds)
        {
            foreach (var item in selectedIds)
            {
                var role = await _roleManager.FindByIdAsync(item);
                role.DateDeleted = null;
                await _roleManager.UpdateAsync(role);
            }
        }

        public async Task MultiSoftDeleteAsync(IList<string> selectedIds)
        {
            foreach (var item in selectedIds)
            {
                //var role =  AppRoles.Where(r => r.Id == Guid.Parse(item)).FirstOrDefault();
                //AppRoles.Remove(role);
                var role2 = await _roleManager.FindByIdAsync(item);
                role2.DateDeleted = DateTime.Now;
                await _roleManager.UpdateAsync(role2);
            }
        }

        public async Task MultiDeleteAsync(IList<string> selectedIds)
        {
            foreach (var item in selectedIds)
            {
                //var role =  AppRoles.Where(r => r.Id == Guid.Parse(item)).FirstOrDefault();
                //AppRoles.Remove(role);
                var role2 = await _roleManager.FindByIdAsync(item);
                await _roleManager.DeleteAsync(role2);
            }
            await _unitOfWork.CommitAsync();
        }

        public async Task RecoverAsync(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            role.DateDeleted = null;
            await _roleManager.UpdateAsync(role);
        }

        public async Task DeleteAsync(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            //var check = _roleManager.RoleExistsAsync(role.Name);                     
            await _roleManager.DeleteAsync(role);            
        }

        public async Task SoftDeleteAsync(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            role.DateDeleted = DateTime.Now;
            await _roleManager.UpdateAsync(role);
        }

        

        

       

        

       
    }
}