using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RicoCore.Data.EF.Migrations
{
    public partial class AddMailQueue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MailQueues",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ToAddress = table.Column<string>(maxLength: 250, nullable: false),
                    CampaignId = table.Column<int>(nullable: true),
                    Subject = table.Column<string>(maxLength: 250, nullable: false),
                    Body = table.Column<string>(nullable: false),
                    SendDate = table.Column<DateTime>(nullable: true),
                    IsSend = table.Column<bool>(nullable: false),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: true),
                    DateDeleted = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MailQueues", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MailQueues");
        }
    }
}
