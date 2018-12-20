import * as ko from 'knockout';
import * as $ from 'jquery';
import { TicketsViewModel, Ticket } from '../tickets/tickets';

class HomePageViewModel {
	public reportYear: number;
	public reportMonth: number;
	ticketsViewModel: TicketsViewModel;

	constructor(params: { reportYear: number, reportMonth: number }) {
		this.reportYear = params.reportYear;
		this.reportMonth = params.reportMonth;

		setTimeout(() => {
			// TODO: not ideal - think of another way later on (postbox?)
			this.ticketsViewModel = ko.dataFor($("tickets").get(0).firstChild);
			
		}, 100);
		
	}

	generateReport(): void {
		const tickets = ko.utils.arrayFilter(this.ticketsViewModel.tickets(), (a: Ticket) => a.isIncluded());

		if (tickets.length === 0) {
			return;
		}

		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "/api/ReportGenerator",
			dataType: "json",
			data: JSON.stringify({ "Tickets": tickets })
		}).then(result => {
			console.log(result);
		});

		//$.post("api/ReportGenerator", JSON.stringify(data));
	}
}

export default { viewModel: HomePageViewModel, template: require('./home-page.html') };
