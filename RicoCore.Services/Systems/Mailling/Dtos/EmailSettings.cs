namespace RicoCore.Services.Systems.Mailling.Dtos
{
    public class EmailSettings
    {
        public int NumberEmailEachTimes { set; get; }
        public string ApiKey { get; set; }
        public string Domain { get; set; }
        public string ApiBaseUri { get; set; }
        public string FromName { get; set; }
        public string From { get; set; }

        public string AccountingEmail { set; get;  }

        public string AdminMail { set; get; }
    }
}