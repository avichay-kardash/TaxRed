namespace TaxRed.API
{
	using System.Collections.Generic;
	using Microsoft.AspNetCore.Mvc;
	using Models;

	public class GenerateReportRequest
	{
		public IList<Ticket> Tickets { get; set; }
	}

	[Route("api/[controller]")]
	[ApiController]
	public class ReportGeneratorController : ControllerBase
	{
		// POST: api/ReportGenerator
		[HttpPost]
		public void Post([FromBody] GenerateReportRequest request)
		{
		}
	}
}
