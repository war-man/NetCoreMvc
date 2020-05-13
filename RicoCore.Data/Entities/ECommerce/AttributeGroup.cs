using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RicoCore.Data.Interfaces;
using RicoCore.Infrastructure.SharedKernel;

namespace RicoCore.Data.Entities.ECommerce
{
    [Table("AttributeGroups")]
    public class AttributeGroup : DomainEntity<Guid>, ISortable
    {
        public AttributeGroup()
        {
        }
        public AttributeGroup(int sortOrder, string name)
        {
            SortOrder = sortOrder;
            Name = name;
        }

        [Required]
        [MaxLength(64)]
        public string Name { set; get; }

        public int SortOrder { get; set; }
    }
}