namespace FinanceTracker.Api.DTOs
{
    public class MonthlySummaryDto
    {
        public string Month { get; set; } // e.g., "June 2025"
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetBalance => TotalIncome - TotalExpenses;
    }
}
