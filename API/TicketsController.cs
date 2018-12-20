namespace TaxRed.API
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Net.Mail;
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
			string username = User.Claims
				.FirstOrDefault(x => x.Type == "preferred_username")
				?.Value;

			if (username == null)
			{
				throw new InvalidOperationException();
			}

			var address = new MailAddress(username);

			IList<Ticket> tickets = _ticketsRepository.GetTicketsFor(address.User).ToList();

			return Ok(tickets);
		}
	}
}