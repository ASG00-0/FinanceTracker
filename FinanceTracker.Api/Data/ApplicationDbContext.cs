using Microsoft.EntityFrameworkCore;
using FinanceTracker.Api.Models;
using System.Collections.Generic;

namespace FinanceTracker.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }

    }
}
