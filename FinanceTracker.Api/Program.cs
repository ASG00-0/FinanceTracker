using FinanceTracker.Api.Data;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=finance.db"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();

    if (!db.Categories.Any())
    {
        db.Categories.AddRange(
            new Category { Name = "Food" },
            new Category { Name = "Rent" },
            new Category { Name = "Entertainment" },
            new Category { Name = "Utilities" }
        );
        db.SaveChanges();
    }
}

app.UseSwagger();
app.UseSwaggerUI();
app.Run();
