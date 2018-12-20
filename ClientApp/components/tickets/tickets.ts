import * as ko from 'knockout';

class Ticket{}

class TicketsViewModel
{
	tickets: KnockoutObservableArray<Ticket>;

	constructor() {
		this.tickets = ko.observableArray<Ticket>();

		fetch("/api/tickets")
			.then(response => response.json() as Promise<Ticket[]>)
			.then(data => {
				this.tickets(data);
			});
	}
}

export default { viewModel: TicketsViewModel, template: require('./tickets.html') };