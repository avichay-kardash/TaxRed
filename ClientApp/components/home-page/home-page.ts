import * as ko from 'knockout';
import * as $ from 'jquery';
import { TicketsViewModel, Ticket } from '../tickets/tickets';
import { CalendarViewModel } from '../calendar/calendar';

class HomePageViewModel {
	public reportYear: number;
	public reportMonth: number;

	constructor(params: { reportYear: number, reportMonth: number }) {
		this.reportYear = params.reportYear;
		this.reportMonth = params.reportMonth;

		//setTimeout(() => {
		//	// TODO: not ideal - think of another way later on (postbox?)
		//	this.ticketsViewModel = ko.dataFor($("tickets").get(0).firstChild);
		//	this.calendarViewModel = ko.dataFor($("calendar").get(0).firstChild);
		//}, 100);
	}

	generateReport(): void {
		var ticketsViewModel: TicketsViewModel = ko.dataFor($("tickets").get(0).firstChild);
		var calendarViewModel = ko.dataFor($("calendar").get(0).firstChild);

		const tickets = ko.utils.arrayFilter(ticketsViewModel.tickets(), (a: Ticket) => a.isIncluded());

		if (tickets.length === 0) {
			return;
		}

		const days = calendarViewModel.days();

		$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/api/ReportGenerator",
				dataType: "json",
				data: ko.toJSON({ "Tickets": tickets, "Days": days , year: this.reportYear, month: this.reportMonth})
			})
			.then((response) => {
				var blobb = new Blob(response.content);
				var link = document.createElement('a');
				link.href = window.URL.createObjectURL(blobb);
				link.download = "report.docx";
				link.click();


			}, error => {
				alert(error);
			});
	}
}

export default { viewModel: HomePageViewModel, template: require('./home-page.html') };
