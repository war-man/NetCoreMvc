using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using RicoCore.Services.Content.PostCategories;
using RicoCore.Services.Content.PostCategories.Dtos;
using RicoCore.Services.Content.Posts;
using RicoCore.Services.Systems.Menus;
using RicoCore.Services.Systems.Menus.Dtos;
using RicoCore.Utilities.Helpers;

namespace RicoCore.Areas.Admin.Controllers
{
    public class MenuController : BaseController
    {
        IMenuService _menuService;
     
        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;            
        }
        public IActionResult Index()
        {
            return View();
        }

        #region Get Data API
        [HttpGet]
        public IActionResult GetAll()
        {
            //var model = new MenuListViewModel();
            //model.PostCategories =_menuService.GetAll();
            //model.SetOrder = _menuService.SetNewOrder();
            var model = _menuService.GetAll();
            return new OkObjectResult(model);
        }


        public IActionResult PrepareSetNewMenu(int parentId)
        {
            var model = _menuService.SetValueToNewMenu(parentId);
            return Json(new
            {
                parentId = model.ParentId,
                parentName = model.ParentName,               
                sortOrder = model.SortOrder               
            });
        }
        [HttpPost]
        public IActionResult SaveEntity(MenuViewModel menuVm)
        {
            try
            {
                if (menuVm.Id == 0)
                {
                    var errorByProductItemName = "Tên menu đã tồn tại";
                    if (_menuService.ValidateAddMenuName(menuVm))
                        ModelState.AddModelError("",
                           errorByProductItemName);

                    if (_menuService.ValidateAddMenuOrder(menuVm))
                        ModelState.AddModelError("",
                            "Thứ tự đã tồn tại");                   

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _menuService.Add(menuVm);
                }
                else
                {
                    var errorByProductItemName = "Tên menu đã tồn tại";
                    if (_menuService.ValidateUpdateMenuName(menuVm))
                        ModelState.AddModelError("",
                           errorByProductItemName);

                    if (_menuService.ValidateUpdateMenuOrder(menuVm))
                        ModelState.AddModelError("",
                            "Thứ tự đã tồn tại");                   

                    if (!ModelState.IsValid)
                        return BadRequest(ModelState.Select(x => x.Value.Errors).FirstOrDefault(y => y.Count > 0)?.First()
                            .ErrorMessage);
                    _menuService.Update(menuVm);
                }

                //if (!ModelState.IsValid)
                //{
                //        IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                //        return new BadRequestObjectResult(allErrors);
                //}

                _menuService.Save();
                return new OkObjectResult(menuVm);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        [HttpGet]
        public IActionResult GetById(int id)
        {
            var model = _menuService.GetById(id);

            return new ObjectResult(model);
        }

        [HttpGet]
        public IActionResult GetNameById(int id)
        {                     
            var name = _menuService.GetNameById(id);
            return Json(new
            {
                name
            });
        }

        

        [HttpPost]
        public IActionResult UpdateParentId(int sourceId, int targetId, Dictionary<int, int> items)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                if (sourceId == targetId)
                {
                    return new BadRequestResult();
                }
                else
                {
                    _menuService.UpdateParentId(sourceId, targetId, items);
                    _menuService.Save();
                    return new OkResult();
                }
            }
        }

        [HttpPost]
        public IActionResult ReOrder(int sourceId, int targetId)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                if (sourceId == targetId)
                {
                    return new BadRequestResult();
                }
                else
                {
                    _menuService.ReOrder(sourceId, targetId);
                    _menuService.Save();
                    return new OkResult();
                }
            }
        }
        #endregion

        [HttpPost]
        public IActionResult Delete(int id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {                
                var subListL2 = _menuService.AllSubCategories(id);
                if (subListL2 != null)
                {
                    foreach (var itemL2 in subListL2)
                    {
                        var subListL3 = _menuService.AllSubCategories(itemL2.Id);
                        if (subListL3 != null)
                        {
                            foreach (var itemL3 in subListL3)
                            {
                                var subListL4 = _menuService.AllSubCategories(itemL3.Id);
                                if (subListL4 != null)
                                {
                                    foreach (var itemL4 in subListL4)
                                    {
                                        var subListL5 = _menuService.AllSubCategories(itemL4.Id);
                                        if (subListL5 != null)
                                        {
                                            foreach (var itemL5 in subListL5)
                                            {
                                                var subListL6 = _menuService.AllSubCategories(itemL5.Id);
                                                if (subListL6 != null)
                                                {
                                                    foreach (var itemL6 in subListL6)
                                                    {
                                                        //var lstIdL6 = _postService.GetIds(itemL6.Id);
                                                        //_postService.MultiDelete(lstIdL6);
                                                        _menuService.Delete(itemL6.Id);
                                                        //_postService.Save();
                                                    }
                                                }
                                                //var lstIdL5 = _postService.GetIds(itemL5.Id);
                                                //_postService.MultiDelete(lstIdL5);
                                                _menuService.Delete(itemL5.Id);
                                                //_postService.Save();
                                            }
                                        }
                                    //var lstIdL4 = _postService.GetIds(itemL4.Id);
                                    //_postService.MultiDelete(lstIdL4);
                                    _menuService.Delete(itemL4.Id);
                                    //_postService.Save();
                                    }    
                                }
                                //var lstIdL3 = _postService.GetIds(itemL3.Id);
                                //_postService.MultiDelete(lstIdL3);
                                _menuService.Delete(itemL3.Id);
                                //_postService.Save();
                            }                            
                        }
                        //var lstIdL2 = _postService.GetIds(itemL2.Id);
                        //_postService.MultiDelete(lstIdL2);
                        _menuService.Delete(itemL2.Id);
                       // _postService.Save();
                    }                    
                }                
                //var lstIdL1 = _postService.GetIds(id);
                //_postService.MultiDelete(lstIdL1);
                //_postService.Save();               
                _menuService.Delete(id);
                _menuService.Save();                
                return new OkObjectResult(id);
            }
        }
    }
}