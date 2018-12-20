namespace TaxRed.API
{
	using System.Collections.Generic;
	using Messaging;
	using Microsoft.AspNetCore.Mvc;

	public class GenerateReportRequest
	{
		public IList<TicketDTO> Tickets { get; set; }
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
