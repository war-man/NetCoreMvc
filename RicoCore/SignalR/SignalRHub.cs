using Microsoft.AspNetCore.SignalR;
using RicoCore.Services.Systems.Announcements.Dtos;
using System.Threading.Tasks;

namespace RicoCore.SignalR
{
    public class SignalRHub : Hub
    {
        public async Task SendMessage(AnnouncementViewModel message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}