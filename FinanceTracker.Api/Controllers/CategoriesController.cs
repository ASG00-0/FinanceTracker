using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Api.Data;
using FinanceTracker.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FinanceTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        [HttpGet]
        [Authorize]
        public IActionResult GetCategories()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var categories = _context.Categories
                .Where(c => c.UserId == userId)
                .ToList();

            return Ok(categories);
        }


        // POST: api/categories
        [HttpPost]
        [Authorize]
        public IActionResult CreateCategory([FromBody] Category category)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            category.UserId = userId;

            _context.Categories.Add(category);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }


        // GET: api/categories/{id}
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetCategoryById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var category = _context.Categories
                .FirstOrDefault(c => c.Id == id && c.UserId == userId);

            if (category == null)
                return NotFound();

            return Ok(category);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteCategory(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var category = _context.Categories
                .FirstOrDefault(c => c.Id == id && c.UserId == userId);

            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return NoContent();
        }

    }
}
