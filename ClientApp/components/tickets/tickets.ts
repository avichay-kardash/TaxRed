import * as ko from 'knockout';

export class Ticket {
	hours: KnockoutObservable<number>;
	isIncluded: KnockoutObservable<boolean>;

	constructor(public link: string, public title: string) {
		this.hours = ko.observable(0);
		this.isIncluded = ko.observable(true);
	}
}

export class TicketsViewModel {
	tickets: KnockoutObservableArray<Ticket>;

	constructor() {
		this.tickets = ko.observableArray<Ticket>();

		fetch("/api/tickets")
			.then(response => response.json() as Promise<Ticket[]>)
			.then(data => {
				var tempArray: Ticket[] = [];

				ko.utils.arrayForEach(data, (item: Ticket) => tempArray.push(new Ticket(item.link, item.title)));
				

				this.tickets(tempArray);
			});
	}
}

export default { viewModel: TicketsViewModel, template: require('./tickets.html') };