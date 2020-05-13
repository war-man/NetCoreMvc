using RicoCore.Utilities.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace RicoCore.Utilities.Test
{
    public class PagedResultTest
    {
        public void Constructor_CreateObject_NotNullObject()
        {
            var pagedResult = new PagedResult<Array>();
            Assert.NotNull(pagedResult);
        }

        public void Constructor_CreateObject_WithResultNotNull()
        {
            var pagedResult = new PagedResult<Array>();
            Assert.NotNull(pagedResult.Results);
        }

    }
}
