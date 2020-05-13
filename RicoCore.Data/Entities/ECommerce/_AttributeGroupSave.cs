using System;
using System.ComponentModel.DataAnnotations.Schema;
using RicoCore.Data.Interfaces;
using RicoCore.Infrastructure.SharedKernel;

namespace RicoCore.Data.Entities.ECommerce
{
    [Table("AttributeGroupsSave")]
    public class AttributeGroupSave : DomainEntity<Guid>, ISortable
    {
        public AttributeGroupSave()
        {
        }
        public AttributeGroupSave(int sortOrder)
        {
            SortOrder = sortOrder;
        }

        

        public int SortOrder { get; set; }
    }
}