namespace TaxRed.API
{
	using System.Collections.Generic;
	using System.Linq;
	using Microsoft.AspNetCore.Mvc;
	using Models;
	using Repositories;

	[Route("api/[controller]")]
	[ApiController]
	public class TicketsController : ControllerBase
	{
		private readonly ITicketsRepository _ticketsRepository;

		public TicketsController(ITicketsRepository ticketsRepository)
		{
			_ticketsRepository = ticketsRepository;
		}

		// api/tickets
		public ActionResult Tickets()
		{
			IList<Ticket> tickets = _ticketsRepository.GetTickets().ToList();

			return Ok(tickets);
		}
	}
}