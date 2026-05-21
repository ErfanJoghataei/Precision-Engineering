using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Precision_Engineering.Bll.Insight;
using Precision_Engineering.Bll.Jwt_Token;
using Precision_Engineering.BusinessLogic.FIle;
using Precision_Engineering.BusinessLogic.Project;
using Precision_Engineering.DAL.Contexts;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
var cnnstring = builder.Configuration.GetConnectionString("cnnstring");
builder.Services.AddDbContext<PrecisionEngineeringDbContext>(option => option.UseSqlServer(cnnstring));

builder.Services.AddScoped<IInsightsServise,InsightsServise>();
builder.Services.AddScoped<IJwtServise, JwtServise>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IFileService, FileService>();

var jwtsetting = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtsetting.Key);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtsetting["Issuer"],
        ValidAudience = jwtsetting["Audience"],
        IssuerSigningKey =
                        new SymmetricSecurityKey(key)
    };

});


builder.Services.AddAuthorization();





var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
