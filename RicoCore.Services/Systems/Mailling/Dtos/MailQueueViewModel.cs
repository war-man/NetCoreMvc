using RicoCore.Infrastructure.SharedKernel;
using System;
using System.ComponentModel.DataAnnotations;

namespace RicoCore.Services.Systems.Mailling.Dtos
{
    public class MailQueueViewModel : DomainEntity<Guid>
    {
        [MaxLength(250)]
        public string ToAddress { set; get; }

        public int CampaignId { set; get; }

        [MaxLength(250)]
        public string Subject { get; set; }

        public string Body { get; set; }

        public DateTime SendDate { set; get; }

        public bool IsSend { set; get; }
        public DateTime DateCreated { set; get; }
        public DateTime? DateModified { set; get; }
    }
}