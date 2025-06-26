using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Api.Data;
using FinanceTracker.Api.Models;

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
        public IActionResult GetCategories()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }

        // POST: api/categories
        [HttpPost]
        public IActionResult CreateCategory([FromBody] Category category)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Categories.Add(category);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }

        // GET: api/categories/{id}
        [HttpGet("{id}")]
        public IActionResult GetCategoryById(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // DELETE: api/categories/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
