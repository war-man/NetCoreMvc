using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RicoCore.Data.Interfaces;
using RicoCore.Infrastructure.SharedKernel;

namespace RicoCore.Data.Entities.ECommerce
{
    [Table("Attributes")]
    public class Attribute : DomainEntity<Guid>, ISortable
    {
        public Attribute()
        {
        }

        public Attribute(Guid attributeGroupId, string name, int sortOrder)
        {
            AttributeGroupId = attributeGroupId;
            SortOrder = sortOrder;
            Name = name;
        }

        //[Required]
        public Guid AttributeGroupId { set; get; }

        [Required]
        [MaxLength(64)]
        public string Name { set; get; }

        public int SortOrder { get; set; }
    }
}