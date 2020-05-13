using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RicoCore.Models.AccountViewModels
{
    public class ForgotPasswordViewModel
    {        
        [Required(ErrorMessage = "Bạn phải nhập {0}")]
        [Display(Name = "Email")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng định dạng.")]
        public string Email { get; set; }
    }
}
