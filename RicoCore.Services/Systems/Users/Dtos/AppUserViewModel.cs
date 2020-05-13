﻿using System;
using System.Collections.Generic;
using System.Web;
using RicoCore.Infrastructure.Enums;

namespace RicoCore.Services.Systems.Users.Dtos
{
    public class AppUserViewModel
    {
        public AppUserViewModel()
        {
            Roles = new List<string>();
        }
        public Guid Id { set; get; }
        public string FullName { set; get; }
        public string BirthDay { set; get; }
        public string Email { set; get; }
        public string Password { set; get; }
        public string UserName { set; get; }
        public string Address { get; set; }
        public string PhoneNumber { set; get; }
        public string Gender { get; set; }
        public decimal Balance { get; set; }
        public string Avatar { get; set; }
        public Status Status { get; set; }
        public ICollection<string> Roles { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { set; get; }
        public DateTime? DateDeleted { set; get; }        
    }
}