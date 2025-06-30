using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Api.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string? UserId { get; set; }  // NEW
        public ApplicationUser User { get; set; }  // NEW

        public List<Transaction> Transactions { get; set; }
    }
}
