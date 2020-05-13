using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RicoCore.Data.Interfaces;
using RicoCore.Infrastructure.SharedKernel;

namespace RicoCore.Data.Entities.ECommerce
{
    [Table("ProductAttributes")]
    public class ProductAttribute : DomainEntity<Guid>
    {
        //[Required]
        public Guid ProductId { set; get; }

        //[Required]
        public Guid AttributeId { set; get; }        

        public string Text { set; get; }
    }
}