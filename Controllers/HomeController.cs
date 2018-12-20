namespace TaxRed.Controllers
{
	using System.Diagnostics;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	public class HomeController : Controller
	{
		[Authorize]
		public IActionResult Index()
		{


			return View();
		}

		public IActionResult Error()
		{
			ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
			return View();
		}
	}
}
