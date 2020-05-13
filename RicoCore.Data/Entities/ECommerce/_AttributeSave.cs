using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RicoCore.Data.Interfaces;
using RicoCore.Infrastructure.SharedKernel;

namespace RicoCore.Data.Entities.ECommerce
{
    [Table("AttributesSave")]
    public class AttributeSave : DomainEntity<Guid>, ISortable
    {
        public AttributeSave()
        {
        }

        public AttributeSave(Guid attributeGroupId, int sortOrder)
        {
            AttributeGroupId = attributeGroupId;
            SortOrder = sortOrder;
        }

        [Required]
        public Guid AttributeGroupId { set; get; }

        public int SortOrder { get; set; }
    }
}