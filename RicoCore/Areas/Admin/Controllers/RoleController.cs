using AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RicoCore.Extensions;
using RicoCore.Services.Systems.Announcements.Dtos;
using RicoCore.Services.Systems.Permissions.Dtos;
using RicoCore.Services.Systems.Roles;
using RicoCore.Services.Systems.Roles.Dtos;
using RicoCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RicoCore.Areas.Admin.Controllers
{
    public class RoleController : BaseController
    {
        private readonly IRoleService _roleService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IHubContext<SignalRHub> _hubContext;

        public RoleController(IRoleService roleService, IAuthorizationService authorizationService, IHubContext<SignalRHub> hubContext)
        {
            _roleService = roleService;
            _hubContext = hubContext;
            _authorizationService = authorizationService;
        }

      

        [HttpPost]
        public IActionResult ListAllFunction(Guid roleId)
        {
            var functions = _roleService.GetListFunctionWithRole(roleId);
            return new OkObjectResult(functions);
        }

        [HttpPost]
        public async Task<IActionResult> SaveEntity(AppRoleViewModel roleVm)
        {
            try
            {
                //if (!ModelState.IsValid)
                //{
                //    IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                //    return new BadRequestObjectResult(allErrors);
                //}
                //if (string.IsNullOrWhiteSpace(roleVm.Id.ToString()) || roleVm.Id == Guid.Empty)
                //if(!roleVm.Id.HasValue)
                //if (roleVm.Id == null)
                if (roleVm.Id == Guid.Empty)
                {
                    var notificationId = Guid.NewGuid();
                    var announcement = new AnnouncementViewModel()
                    {
                        Title = "Role created",
                        DateCreated = DateTime.Now,
                        //Content = result ? $"Quyền {roleVm.Name} đã được tạo" : $"Quyền {roleVm.Name} tạo không thành công",
                        Id = notificationId,
                        OwnerId = User.GetUserId()
                    };
                    var announcementUsers = new List<AnnouncementUserViewModel>()
                {
                    new AnnouncementUserViewModel(){AnnouncementId=notificationId, HasRead=false, UserId = User.GetUserId()}
                };
                    await _roleService.AddAsync(announcement, announcementUsers, roleVm);
                    await _hubContext.Clients.All.SendAsync("ReceiveMessage", announcement);
                }
                else
                {
                    await _roleService.UpdateAsync(roleVm);
                }
                return new OkObjectResult(roleVm);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
       
        public async Task<IActionResult> GetById(Guid Id)
        {
            var model = await _roleService.GetById(Id);
            return new ObjectResult(model);
        }

        [HttpPost]
        public async Task<IActionResult> SavePermission(List<PermissionViewModel> listPermmission, Guid roleId)
        {
            try
            {
                await _roleService.SavePermission(listPermmission, roleId);
                return new OkResult();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<IActionResult> GetAll()
        {
            var model = await _roleService.GetAllAsync(string.Empty);
            return new ObjectResult(model);
        }



        public async Task<IActionResult> Index()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "ROLE", Operations.Read);
            if (result.Succeeded == false)
            {
                return new RedirectResult("/Admin/Home/AccessDeny");
            }
            return View();
        }

        [HttpGet]
        public IActionResult GetAllPaging(string keyword, int page, int pageSize)
        {
            var model = _roleService.GetAllPagingAsync(keyword, page, pageSize);
            return new OkObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetAllSoftDeletePagingAsync(string keyword, int page, int pageSize)
        {
            var model = _roleService.GetAllSoftDeletePagingAsync(keyword, page, pageSize);
            return new OkObjectResult(model);
        }



        public IActionResult SoftDelete()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> MultiRecoverAsync(ICollection<string> selectedIds)
        {
            if (selectedIds != null)
            {
                await _roleService.MultiRecoverAsync(selectedIds.ToList());
            }
            return Json(new { Result = true });
        }

        [HttpPost]
        public async Task<IActionResult> MultiSoftDeleteAsync(ICollection<string> selectedIds)
        {
            if (selectedIds != null)
            {
                await _roleService.MultiSoftDeleteAsync(selectedIds.ToList());
            }
            return Json(new { Result = true });
        }

        [HttpPost]
        public async Task<IActionResult> MultiDeleteAsync(ICollection<string> selectedIds)
        {
            if (selectedIds != null)
            {
                await _roleService.MultiDeleteAsync(selectedIds.ToList());
            }
            return Json(new { Result = true });
        }
       

        [HttpPost]
        public async Task<IActionResult> RecoverAsync(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            await _roleService.RecoverAsync(id);
            return new OkObjectResult(id);
        }

        [HttpPost]
        public async Task<IActionResult> SoftDeleteAsync(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            await _roleService.SoftDeleteAsync(id);
            return new OkObjectResult(id);
        }


        [HttpPost]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            await _roleService.DeleteAsync(id);
            return new OkObjectResult(id);
        }        
    }
}