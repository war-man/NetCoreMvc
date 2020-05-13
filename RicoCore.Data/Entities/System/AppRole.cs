using Microsoft.AspNetCore.Identity;
using RicoCore.Data.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RicoCore.Data.Entities.System
{
    [Table("AppRoles")]
    /// AppRole inherit from IdentityRole:
    /// using Microsoft.AspNetCore.Identity;   
    public class AppRole : IdentityRole<Guid>, IDateTracking
    {
        public AppRole() : base()
        {
        }

        public AppRole(string name, string description) : base(name)
        {
            Description = description;
        }

        [StringLength(255)]
        public string Description { get; set; }
        public DateTime DateCreated { set; get; }
        public DateTime? DateModified { set; get; }
        public DateTime? DateDeleted { set; get; }
    }
}