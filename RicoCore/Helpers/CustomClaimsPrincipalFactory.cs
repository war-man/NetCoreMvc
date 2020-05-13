﻿using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Threading.Tasks;
using RicoCore.Data.Entities;
using RicoCore.Data.Entities.System;

namespace RicoCore.Helpers
{
    public class CustomClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppUser, AppRole>
    {
        private readonly UserManager<AppUser> _userManager;

        public CustomClaimsPrincipalFactory(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IOptions<IdentityOptions> options) :
              base(userManager, roleManager, options)
        {
            _userManager = userManager;
        }

        public async override Task<ClaimsPrincipal>CreateAsync(AppUser user)
        {
            var principal = await base.CreateAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            // Add your claims here
            ((ClaimsIdentity)principal.Identity).AddClaims(new[] {
                new Claim("UserId",user.Id.ToString()),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim("FullName",user.FullName),
                new Claim("UserName",user.UserName),
                new Claim("Avatar",string.IsNullOrEmpty(user.Avatar)?string.Empty:user.Avatar),
                new Claim("Roles",string.Join(";",roles))

                //new Claim(ClaimTypes.NameIdentifier, user.UserName),
                //new Claim("Email",user.Email),
                //new Claim("FullName",user.FullName),
                //new Claim("Avatar",user.Avatar??string.Empty),
                //new Claim("Roles",string.Join(";",roles)),
                //new Claim("UserId", user.Id.ToString())
            });

            return principal;
        }
    }
}