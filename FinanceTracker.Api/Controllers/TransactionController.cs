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
        public async Task<IActionResult> GetTransactions()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Get data first, then order client-side
            var transactions = await _context.Transactions
                .Where(t => t.UserId == userId)
                .Include(t => t.Category)
                .ToListAsync(); // First get all data async

            var result = transactions
                .OrderBy(t => t.Amount) // Then order in memory
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Amount = t.Amount,
                    Type = t.Type,
                    Date = t.Date,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category?.Name
                })
                .ToList();

            return Ok(result);
        }


        // POST: api/transactions
        [HttpPost]
        public IActionResult CreateTransaction([FromBody] Transaction transaction)
        {
            Console.WriteLine("---- Incoming Transaction Payload ----");
            Console.WriteLine($"Title: {transaction.Title}");
            Console.WriteLine($"Amount: {transaction.Amount}");
            Console.WriteLine($"Type: {transaction.Type}");
            Console.WriteLine($"Date: {transaction.Date}");
            Console.WriteLine($"CategoryId: {transaction.CategoryId}");

            if (!ModelState.IsValid)
            {
                Console.WriteLine("---- ModelState Errors ----");
                foreach (var entry in ModelState)
                {
                    foreach (var error in entry.Value.Errors)
                    {
                        Console.WriteLine($"{entry.Key}: {error.ErrorMessage}");
                    }
                }
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                Console.WriteLine("User ID could not be extracted from token.");
                return Unauthorized();
            }

            Console.WriteLine($"User ID from token: {userId}");
            transaction.UserId = userId;

            var category = _context.Categories.FirstOrDefault(c => c.Id == transaction.CategoryId);
            if (category == null)
            {
                Console.WriteLine($"No category found with ID {transaction.CategoryId}");
                return BadRequest(new { message = "Invalid category ID." });
            }

            Console.WriteLine($"Category found: {category.Name} ({category.Type})");

            _context.Transactions.Add(transaction);
            _context.SaveChanges();

            var result = new TransactionDto
            {
                Id = transaction.Id,
                Title = transaction.Title,
                Amount = transaction.Amount,
                Type = transaction.Type,
                Date = transaction.Date,
                CategoryId = transaction.CategoryId,
                CategoryName = category.Name
            };

            return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, result);
        }




        // GET: api/transactions/{id}
        [HttpGet("{id}")]
        public IActionResult GetTransactionById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var transaction = _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefault(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
                return NotFound();

            var result = new TransactionDto
            {
                Id = transaction.Id,
                Title = transaction.Title,
                Amount = transaction.Amount,
                Type = transaction.Type,
                Date = transaction.Date,
                CategoryId = transaction.CategoryId,
                CategoryName = transaction.Category?.Name
            };

            return Ok(result);
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
                .ToList() // Execute query first
                .OrderByDescending(x => x.TotalSpent) // Then order in memory
                .ToList();

            return Ok(spending);
        }

    }

}