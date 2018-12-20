namespace TaxRed.Repositories
{
	using System.Collections.Generic;
	using Models;

	public interface ITicketsRepository
	{
		IEnumerable<Ticket> GetTickets();
	}
}
