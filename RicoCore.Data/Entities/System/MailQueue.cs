using RicoCore.Data.Interfaces;
using RicoCore.Infrastructure.SharedKernel;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RicoCore.Data.Entities.System
{
    [Table("MailQueues")]
    public class MailQueue : DomainEntity<Guid>, IDateTracking
    {
        [MaxLength(250)]
        [Required]
        public string ToAddress { set; get; }

        public int? CampaignId { set; get; }

        [MaxLength(250)]
        [Required]
        public string Subject { get; set; }

        [Required]
        public string Body { get; set; }

        public DateTime? SendDate { set; get; }

        public bool IsSend { set; get; }

        public DateTime DateCreated { set; get; }
        public DateTime? DateModified { set; get; }
        public DateTime? DateDeleted { set; get; }
    }
}