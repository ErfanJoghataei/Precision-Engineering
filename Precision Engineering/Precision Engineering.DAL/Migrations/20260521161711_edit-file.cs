using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Precision_Engineering.DAL.Migrations
{
    /// <inheritdoc />
    public partial class editfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Files");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Insights",
                newName: "Title");

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Insights",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Insights");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Insights",
                newName: "ImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Files",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
