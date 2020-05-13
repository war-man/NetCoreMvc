using System;
using System.Collections.Generic;
using System.Text;

namespace RicoCore.Utilities.Constants
{
    public class CommonConstants
    {
        public static string DefaultFooterId = "default";
        //public const string DefaultFooterId = "default";
        //public const string DefaultContactId = "default";
        public const string CartSession = "CartSession";
        public const string ProductTag = "Product";
        public const string PostTag = "Post";        
        public const string DefaultGuid = "00000000-0000-0000-0000-000000000000";
        public class AppRole
        {
            public const string Admin = "Admin";
            public const string Rico = "Rico";
        }

        public class UserClaims
        {
            public const string Roles = "Roles";
        }

        public class AppSettings
        {
            public const string BackendUrl = "BackendUrl";
            public const string PortalUrl = "PortalUrl";
            public const string SystemName = "SystemName";
            public const string AccountingEmail = "AccountingEmail";
            public const string AdminEmail = "AdminEmail";
            public const string HomeTitle = "HomeTitle";
            public const string HomeKeyword = "HomeKeyword";
            public const string HomeDescription = "HomeDescription";
            public const string MaxSizeDisplay = "MaxSizeDisplay";
            public const string NoImage = "NoImage";
            public const string ImageFolder = "ImageFolder";

        }
    }
}
