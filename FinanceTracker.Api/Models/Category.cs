using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Api.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        // Navigation property
        public List<Transaction> Transactions { get; set; }
    }
}
