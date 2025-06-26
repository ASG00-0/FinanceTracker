namespace FinanceTracker.Api.DTOs
{
    public class TransactionSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetBalance => TotalIncome - TotalExpenses;
    }
}
