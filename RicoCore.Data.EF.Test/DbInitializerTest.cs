using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using RicoCore.Data.Entities.System;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RicoCore.Data.EF.Test
{
    public class DbInitializerTest
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        public DbInitializerTest()
        {
            _context = ContextFactory.Create();
            _context.Database.EnsureCreated();

            var mockUserManager = new Mock<UserManager<AppUser>>(
                new Mock<IUserStore<AppUser>>().Object,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<IPasswordHasher<AppUser>>().Object,
                new IUserValidator<AppUser>[0],
                new IPasswordValidator<AppUser>[0],
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<IServiceProvider>().Object,
                new Mock<ILogger<UserManager<AppUser>>>().Object);

            var mockRoleManager = new Mock<RoleManager<AppRole>>(
                new Mock<IRoleStore<AppRole>>().Object,
                new IRoleValidator<AppRole>[0],
                new Mock<ILookupNormalizer>().Object,
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<ILogger<RoleManager<AppRole>>>().Object);
                
                }

        public async Task Should_Success_When_Seed_Data()
        {

        }

        
    }
}
