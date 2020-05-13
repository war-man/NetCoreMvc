using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RicoCore.Models;
using RicoCore.Utilities.Constants;
using RicoCore.Extensions;
using RicoCore.Services.ECommerce.Products;
using RicoCore.Services.ECommerce.Bills;
using RicoCore.Services;
using Microsoft.Extensions.Configuration;
using RicoCore.Services.ECommerce.Bills.Dtos;
using RicoCore.Data.Enums;
using System.Security.Claims;
using RicoCore.Services.ECommerce.Products.Dtos;

namespace RicoCore.Controllers
{
    public class CartController : Controller
    {
        private readonly IProductService _productService;
        private readonly IBillService _billService;
        private readonly IViewRenderService _viewRenderService;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        public CartController(IProductService productService,
            IViewRenderService viewRenderService, IEmailSender emailSender,
            IConfiguration configuration, IBillService billService)
        {
            _productService = productService;
            _billService = billService;
            _viewRenderService = viewRenderService;
            _configuration = configuration;
            _emailSender = emailSender;
        }

        [Route("gio-hang", Name = "Cart")]
        public IActionResult Index()
        {
            ViewData["BodyClass"] = "shopping-cart-page";
            return View();
        }

        [Route("dat-hang", Name = "Checkout")]
        [HttpGet]
        public IActionResult Checkout()
        {
            try
            {
                ViewData["BodyClass"] = "checkout-page";
                var model = new CheckoutViewModel();
                var session = HttpContext.Session.Get<List<ShoppingCartViewModel>>(CommonConstants.CartSession);
                //if (session.Any(x => x.Color == null))
                //{

                //    return Redirect("/gio-hang");
                //}

                model.Carts = session;
                return View(model);
            }
            catch (Exception  ex)
            {
                throw ex;
            }            
        }

        [Route("dat-hang", Name = "Checkout")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Checkout(CheckoutViewModel model)
        {
            try
            {
                var session = HttpContext.Session.Get<List<ShoppingCartViewModel>>(CommonConstants.CartSession);
                if (ModelState.IsValid)
                {
                    if (session != null)
                    {
                        var details = new List<BillDetailViewModel>();
                        foreach (var item in session)
                        {
                            details.Add(new BillDetailViewModel()
                            {
                                
                                Price = item.Price,
                                Color = item.Color,
                                ProductName = item.Product.Name,                               
                                Code = item.Product.Code,
                                //ColorId = item.Color.Id,
                                Quantity = item.Quantity,
                                ProductId = item.Product.Id
                            });
                        }
                        var billViewModel = new BillViewModel()
                        {
                            CustomerMobile = model.CustomerMobile,
                            BillStatus = BillStatus.New,
                            CustomerAddress = model.CustomerAddress,
                            CustomerName = model.CustomerName,
                            ShipMobile = model.ShipMobile,
                            ShipAddress = model.ShipAddress,
                            ShipName = model.ShipName,
                            Status = Infrastructure.Enums.Status.Actived,
                            PaymentMethod = model.PaymentMethod,
                            //BillDetails = details                        
                        };                        

                        if (User.Identity.IsAuthenticated == true)
                        {
                            billViewModel.CustomerId = Guid.Parse(User.GetSpecificClaim("UserId"));
                        }

                        _billService.Add(billViewModel, out var billId);

                        if (details != null)
                        {
                            foreach (var item in details)
                            {
                                item.BillId = billId;
                                _billService.AddDetail(item);
                            }
                        }

                        try
                        {
                            _billService.Save();
                            //var content = await _viewRenderService.RenderToStringAsync("Cart/_BillMail", billViewModel);
                            //Send mail
                            //await _emailSender.SendEmailAsync(_configuration["MailSettings:AdminMail"], "Đặt hàng từ Rèm Đức Trung", content);
                            ViewData["Success"] = true;
                        }
                        catch (Exception ex)
                        {
                            ViewData["Success"] = false;
                            ModelState.AddModelError("", ex.Message);
                        }
                    }
                }
                model.Carts = session;
                return View(model);
            }
            catch (Exception ex)
            {

                throw ex;
            }            
        }



        /// <summary>
        /// Get list item
        /// </summary>
        /// <returns></returns>
        public IActionResult GetCart()
        {
            var session = HttpContext.Session.Get<List<ShoppingCartViewModel>>(CommonConstants.CartSession);
            if (session == null)
                session = new List<ShoppingCartViewModel>();
            return new OkObjectResult(session);
        }

        /// <summary>
        /// Remove all products in cart
        /// </summary>
        /// <returns></returns>
        public IActionResult ClearCart()
        {
            HttpContext.Session.Remove(CommonConstants.CartSession);
            return new OkObjectResult("OK");
        }

        /// <summary>
        /// Add product to cart
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        //[HttpPost]
        //public IActionResult AddToCart(Guid productId, int quantity, int color)
        //{
        //    try
        //    {
        //        //Get product detail
        //        var product = _productService.GetById(productId);

        //        //Get session with item list from cart
        //        var session = HttpContext.Session.Get<List<ShoppingCartViewModel>>(CommonConstants.CartSession);
        //        if (session != null)
        //        {
        //            //Convert string to list object
        //            bool hasChanged = false;

        //            //Check exist with item product id
        //            if (session.Any(x => x.Product.Id == productId))
        //            {
        //                foreach (var item in session)
        //                {
        //                    //Update quantity for product if match product id
        //                    if (item.Product.Id == productId)
        //                    {
        //                        item.Quantity += quantity;
        //                        item.Price = product.Price;
        //                        //item.Price = product.PromotionPrice ?? product.Price;
        //                        hasChanged = true;
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                session.Add(new ShoppingCartViewModel()
        //                {
        //                    Product = product,
        //                    Quantity = quantity,
        //                    Color = _billService.GetColor(color),
        //                    //Size = _billService.GetSize(size),
        //                    //Price = product.PromotionPrice ?? product.Price
        //                    Price = product.Price
        //                });
        //                hasChanged = true;
        //            }

        //            //Update back to cart
        //            if (hasChanged)
        //            {
        //                HttpContext.Session.Set(CommonConstants.CartSession, session);
        //            }
        //        }
        //        else
        //        {
        //            //Add new cart
        //            var cart = new List<ShoppingCartViewModel>();
        //            cart.Add(new ShoppingCartViewModel()
        //            {
        //                Product = product,
        //                Quantity = quantity,
        //                Color = _billService.GetColor(color),
        //                //Size = _billService.GetSize(size),
        //                //Price = product.PromotionPrice ?? product.Price
        //                Price = product.Price
        //            });
        //            HttpContext.Session.Set(CommonConstants.CartSession, cart);
        //        }
        //        return new OkObjectResult(productId);
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }

        //}

        /// <summary>
        /// Add product item to cart
        /// </summary>
        /// <param name="productItemId"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult AddProductItemToCart(Guid productId, int quantity)
        {
            try
            {
                //Get product detail
                //var productItem = _productService.GetProductItemById(productItemId);
                //var color = productItem.ColorName;
                var product = _productService.GetById(productId);
                var productUrl = product.Url;

                //Get session with item list from cart
                var session = HttpContext.Session.Get<List<ShoppingCartViewModel>>(CommonConstants.CartSession);
                if (session != null)
                {
                    //Convert string to list object
                    bool hasChanged = false;

                    //Check exist with item product id
                    if (session.Any(x => x.Product.Id == productId))
                    {
                        foreach (var item in session)
                        {
                            //Update quantity for product if match product id
                            if (item.Product.Id == productId)
                            {
                                item.Quantity += quantity;                               
                                item.Price = product.Price;
                                item.Color = "Black";
                                item.ProductUrl = productUrl;                                
                                hasChanged = true;
                            }
                        }
                    }
                    else
                    {
                        session.Add(new ShoppingCartViewModel()
                        {
                            Product = product,                                               
                            Quantity = quantity,
                            Color = "Black",
                        //Color = _billService.GetColor(color),
                        //Size = _billService.GetSize(size),
                        ProductUrl = productUrl,                           
                        Price = product.Price
                        });
                        hasChanged = true;
                    }

                    //Update back to cart
                    if (hasChanged)
                    {
                        HttpContext.Session.Set(CommonConstants.CartSession, session);
                    }
                }
                else
                {
                    //Add new cart
                    var cart = new List<ShoppingCartViewModel>();
                    cart.Add(new ShoppingCartViewModel()
                    {
                        Product = product,                       
                        Quantity = quantity,
                        Color = "Black",
                        //Color = _billService.GetColor(color),
                        //Size = _billService.GetSize(size),
                        Price = product.Price,
                        ProductUrl = productUrl
                });
                    HttpContext.Session.Set(CommonConstants.CartSession, cart);
                }
                return new OkObjectResult(productId);
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        /// <summary>
        /// Remove a product
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public IActionResult RemoveFromCart(Guid productId)
        {
            var session = HttpContext.Session.Get<List<ShoppingCartViewModel>>(CommonConstants.CartSession);
            if (session != null)
            {
                bool hasChanged = false;
                foreach (var item in session)
                {
                    if (item.Product.Id == productId)
                    {
                        session.Remove(item);
                        hasChanged = true;
                        break;
                    }
                }
                if (hasChanged)
                {
                    HttpContext.Session.Set(CommonConstants.CartSession, session);
                }
                return new OkObjectResult(productId);
            }
            return new EmptyResult();
        }

        /// <summary>
        /// Update product quantity
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public IActionResult UpdateCart(Guid productId, int quantity)
        {
            var session = HttpContext.Session.Get<List<ShoppingCartViewModel>>(CommonConstants.CartSession);
            if (session != null)
            {
                bool hasChanged = false;
                foreach (var item in session)
                {
                    if (item.Product.Id == productId)
                    {                       
                        var product = _productService.GetById(productId);
                        var url = product.Url;                      
                        //item.Product = product;
                        //item.Size = _billService.GetSize(size);
                        //item.Color = _billService.GetColor(color);                     
                        item.Color = "Black";
                        item.Quantity = quantity;
                        item.Price = product.Price;
                        item.ProductUrl = url;
                        hasChanged = true;
                    }
                }
                if (hasChanged)
                {
                    HttpContext.Session.Set(CommonConstants.CartSession, session);
                }
                return new OkObjectResult(productId);
            }
            return new EmptyResult();
        }

        [HttpGet]
        public IActionResult GetColors()
        {
            var colors = _billService.GetColors();
            return new OkObjectResult(colors);
        }

        [HttpGet]
        public IActionResult GetSizes()
        {
            var sizes = _billService.GetSizes();
            return new OkObjectResult(sizes);
        }

    

    }
}