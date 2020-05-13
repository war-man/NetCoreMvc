﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RicoCore.Data.Interfaces;
using RicoCore.Infrastructure.SharedKernel;

namespace RicoCore.Data.Entities.ECommerce
{
    [Table("AttributeDescriptions")]
    public class AttributeDescription : DomainEntity<Guid>, IMultiLanguage<Guid>
    {
        public AttributeDescription()
        {
        }

        public AttributeDescription(Guid attributeId, Guid languageId)
        {
            AttributeId = attributeId;
            LanguageId = languageId;           
        }

        [Required]
        public Guid AttributeId { set; get; }

        [Required]
        public Guid LanguageId { set; get; }

        
    }
}