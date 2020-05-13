using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace RicoCore.Data.EF.Test
{
    public class AppDbContextTest
    {
        [Fact]
        public void Constructor_CreateInMemoryDb_Success()
        {

            var context = ContextFactory.Create();
            Assert.True(context.Database.EnsureCreated());
        }        
    }
}
