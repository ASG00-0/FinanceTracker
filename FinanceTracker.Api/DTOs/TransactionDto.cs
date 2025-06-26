namespace FinanceTracker.Api.DTOs
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}
