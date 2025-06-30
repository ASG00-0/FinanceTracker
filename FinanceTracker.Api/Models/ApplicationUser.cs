using Microsoft.AspNetCore.Identity;

namespace FinanceTracker.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
    }
}
