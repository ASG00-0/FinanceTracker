using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Api.Models
{
    public class Transaction
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Type { get; set; } // "Income" or "Expense"

        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        public int CategoryId { get; set; }

        public Category? Category { get; set; } // <- make it nullable
        public string UserId { get; set; }  // Foreign key to AspNetUsers
        public ApplicationUser User { get; set; }  // Navigation property

    }
}
