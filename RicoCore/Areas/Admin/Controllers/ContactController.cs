using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using RicoCore.Services.Content.Contacts;
using RicoCore.Services.Content.Contacts.Dtos;
using RicoCore.Services.Content.PostCategories;
using RicoCore.Services.Content.PostCategories.Dtos;
using RicoCore.Services.Content.Posts;
using RicoCore.Services.Systems.Menus;
using RicoCore.Services.Systems.Menus.Dtos;
using RicoCore.Utilities.Helpers;

namespace RicoCore.Areas.Admin.Controllers
{
    public class ContactController : BaseController
    {
        IContactService _contactService;
     
        public ContactController(IContactService menuService)
        {
            _contactService = menuService;            
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAllPaging(string keyword, int page, int pageSize)
        {
            var sortBy = string.Empty;
            //var productCategoryId = int.Parse(productCategoryIdStr);           
            var model = _contactService.GetAllPaging(keyword, page, pageSize);
            return new OkObjectResult(model);
        }

        #region Get Data API

        public IActionResult GetAll()
        {
            try
            {
                var model = _contactService.GetAll();
                return new OkObjectResult(model);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpGet]
        public IActionResult GetById(int id)
        {
            var model = _contactService.GetById(id);
            return new ObjectResult(model);
        }

        [HttpPost]
        public IActionResult SaveEntity(ContactDetailViewModel contactVm)
        {
            try
            {
                if (contactVm.Id == 0)
                {
                    var errorBySlideName = "Tên slide đã tồn tại";
                    if (_contactService.ValidateAddContactDetailName(contactVm))
                        ModelState.AddModelError("",
                           errorBySlideName);
                   
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _contactService.Add(contactVm);
                }
                else
                {
                    var errorBySlideName = "Tên slide đã tồn tại";
                    if (_contactService.ValidateUpdateContactDetailName(contactVm))
                        ModelState.AddModelError("",
                           errorBySlideName);                  

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);

                    _contactService.Update(contactVm);
                }

                //if (!ModelState.IsValid)
                //{
                //    IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                //    return new BadRequestObjectResult(allErrors);
                //}

                _contactService.Save();
                return new OkObjectResult(contactVm);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        #endregion Get Data API

        [HttpPost]
        public IActionResult Delete(int id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                _contactService.Delete(id);
                _contactService.Save();
                return new OkObjectResult(id);
            }
        }



        [HttpPost]
        public IActionResult MultiDelete(ICollection<string> selectedIds)
        {
            try
            {
                if (selectedIds != null)
                {
                    _contactService.MultiDelete(selectedIds.ToList());
                    _contactService.Save();
                }
                return new OkResult();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}