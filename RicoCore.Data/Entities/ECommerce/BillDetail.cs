using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using RicoCore.Infrastructure.SharedKernel;

namespace RicoCore.Data.Entities
{
    [Table("BillDetails")]
    public class BillDetail : DomainEntity<Guid>
    {
        public BillDetail() { }
        public BillDetail(Guid id, Guid billId, string code, Guid productId, string productName, int quantity, decimal price, string color)
        {
            Id = id;
            BillId = billId;
            ProductId = productId;
            ProductName = productName;
            Quantity = quantity;
            Price = price;
            Color = color;            
            Code = code;          
            //SizeId = sizeId;
        }

        public BillDetail(Guid billId, string code, Guid productId, string productName, int quantity, decimal price, string color)
        {
            BillId = billId;           
            Quantity = quantity;
            Price = price;
            Color = color;          
            Code = code;
            ProductId = productId;
            ProductName = productName;
            //SizeId = sizeId;
        }

        public Guid BillId { set; get; }
        public string Code { set; get; }
        public Guid ProductId { set; get; }
        public string ProductName { set; get; }       
        public int Quantity { set; get; }

        public decimal Price { set; get; }
        
        public string Color { get; set; }

        //public Guid? SizeId { get; set; }

        //[ForeignKey("BillId")]
        //public virtual Bill Bill { set; get; }

        //[ForeignKey("ProductId")]
        //public virtual Product Product { set; get; }

        //[ForeignKey("ColorId")]
        //public virtual Color Color { set; get; }

        //[ForeignKey("SizeId")]
        //public virtual Size Size { set; get; }
    }
}
