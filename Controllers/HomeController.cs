using System;

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
			var reportDate = GetReportDate();
			ViewBag.ReportYear = reportDate.Year;
			ViewBag.ReportMonth = reportDate.Month;

			return View();
		}

		private DateTime GetReportDate()
		{
			DateTime now = DateTime.UtcNow;
			DateTime reportDate = new DateTime(now.Year, now.Month, 1).AddMonths(-1);

			return reportDate;
		}

		public IActionResult Error()
		{
			ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
			return View();
		}
	}
}
