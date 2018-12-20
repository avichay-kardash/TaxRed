using System.
	IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using TaxRed.Reports;

namespace TaxRed.API
{
	using System.Collections.Generic;
	using Messaging;
	using Microsoft.AspNetCore.Mvc;

	public class GenerateReportRequest
	{
		public int Year { get; set; }
		public int Month { get; set; }

		public IList<TicketDTO> Tickets { get; set; }

		public IList<DayDTO> Days { get; set; }
	}

	[Route("api/[controller]")]
	[ApiController]
	public class ReportGeneratorController : ControllerBase
	{
		private readonly IReportBuilder _reportBuilder;

		public ReportGeneratorController(IReportBuilder reportBuilder)
		{
			_reportBuilder = reportBuilder;
		}

		// POST: api/ReportGenerator
		[HttpPost]
		public HttpResponseMessage Post([FromBody] GenerateReportRequest request)
		{
			using (var report = _reportBuilder.Build(new ReportBuilderArgs
			{
				Employee = User.Identity.Name,
				Month = request.Month,
				Year = request.Year,
				Tickets = request.Tickets.Select(t=> $"{t.Title} [{t.Hours}h]").ToList(),
				EmployeePosition = "???"
			}))
			{

				var dataBytes = System.IO.File.ReadAllBytes(report.Path);

				//adding bytes to memory stream   
				var dataStream = new MemoryStream(dataBytes);

				HttpResponseMessage httpResponseMessage = new HttpResponseMessage(HttpStatusCode.OK);
				httpResponseMessage.Content = new ByteArrayContent(dataStream.ToArray());
				httpResponseMessage.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
				httpResponseMessage.Content.Headers.ContentDisposition.FileName = report.TargetFilename;
				httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

				return httpResponseMessage;
			}
		}
	}
}
