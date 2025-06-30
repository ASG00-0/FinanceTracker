using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Api.Data;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;
using FinanceTracker.Api.DTOs;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FinanceTracker.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/transactions
        [HttpGet]
        public IActionResult GetTransactions()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var transactions = _context.Transactions
                .Where(t => t.UserId == userId)
                .Include(t => t.Category)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Amount = t.Amount,
                    Type = t.Type,
                    Date = t.Date,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.Name
                })
                .ToList();

            return Ok(transactions);
        }


        // POST: api/transactions
        [HttpPost]
        public IActionResult CreateTransaction([FromBody] Transaction transaction)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = _context.Categories.Find(transaction.CategoryId);
            if (category == null)
                return BadRequest("Invalid category ID");

            // Get current user's ID from JWT
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            transaction.UserId = userId;

            _context.Transactions.Add(transaction);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, transaction);
        }


        // GET: api/transactions/{id}
        [HttpGet("{id}")]
        public IActionResult GetTransactionById(int id)
        {
            var transaction = _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefault(t => t.Id == id);

            if (transaction == null)
                return NotFound();

            return Ok(transaction);
        }

        // DELETE: api/transactions/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteTransaction(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var transaction = _context.Transactions
                .FirstOrDefault(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
                return NotFound();

            _context.Transactions.Remove(transaction);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var transactions = _context.Transactions
                .Where(t => t.UserId == userId)
                .ToList();

            var income = transactions
                .Where(t => t.Type == "Income")
                .Sum(t => t.Amount);

            var expenses = transactions
                .Where(t => t.Type == "Expense")
                .Sum(t => t.Amount);

            var summary = new TransactionSummaryDto
            {
                TotalIncome = income,
                TotalExpenses = expenses
            };

            return Ok(summary);
        }


        [HttpGet("summary/monthly")]
        public IActionResult GetMonthlySummary()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var transactions = _context.Transactions
                .Where(t => t.UserId == userId)
                .ToList();

            var monthlySummaries = transactions
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g =>
                {
                    var income = g.Where(t => t.Type == "Income").Sum(t => t.Amount);
                    var expenses = g.Where(t => t.Type == "Expense").Sum(t => t.Amount);
                    var monthName = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM yyyy");

                    return new MonthlySummaryDto
                    {
                        Month = monthName,
                        TotalIncome = income,
                        TotalExpenses = expenses
                    };
                })
                .OrderByDescending(m => m.Month)
                .ToList();

            return Ok(monthlySummaries);
        }

        [HttpGet("summary/by-category")]
        [Authorize]
        public IActionResult GetSpendingByCategory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var spending = _context.Transactions
                .Where(t => t.UserId == userId && t.Type == "Expense")
                .GroupBy(t => t.Category.Name)
                .Select(g => new CategorySpendingDto
                {
                    CategoryName = g.Key,
                    TotalSpent = g.Sum(t => t.Amount)
                })
                .OrderByDescending(x => x.TotalSpent)
                .ToList();

            return Ok(spending);
        }

    }

}
