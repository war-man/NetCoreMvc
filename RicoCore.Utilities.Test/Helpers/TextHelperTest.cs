using RicoCore.Utilities.Helpers;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace RicoCore.Utilities.Test.Helpers
{
    public class TextHelperTest
    {
        [Theory]
        [InlineData("Rèm cửa Tuấn Anh - Rèm uy tín  ")]
        [InlineData("Rèm cửa Tuấn Anh -- Rèm uy tín  ")]
        [InlineData("Rèm cửa Tuấn Anh - Rèm uy tín?")]
        [InlineData("Rèm cửa Tuấn Anh       - Rèm uy tín?")]
        public void ToUnsignString_UpperCaseInput_LowerCaseOutput(string input)
        {
            var result = TextHelper.ToUnsignString(input);
            Assert.Equal("rem-cua-tuan-anh-rem-uy-tin", result);
        }

        [Fact]
        public void ToString_NumberInput_CharactersNumber()
        {
            var result = TextHelper.ToString(120);
            Assert.Equal("một trăm hai mươi đồng chẵn", result);
        }
    }
}
