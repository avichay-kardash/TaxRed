import * as ko from 'knockout';

interface CalendarParams {
	year: number;
	month: number;
}

class Calendar {
	days: CalendarDay[] = [];
}

enum CalendarDayState {
	Work = 1,
	DayOff = 2,
	SickLeave = 3,
	Holiday = 4
}

class CalendarDay {
	weekIndex: number = 0;
	dayOfWeek: number = 0;
	dayOfMonth: number = 0;
	state: CalendarDayState = CalendarDayState.Work;
}


class CalendarDayViewModel {
	weekIndex: number = 0;
	dayOfWeek: number = 0;
	dayOfMonth: number = 0;
	state: KnockoutObservable<CalendarDayState> = ko.observable(CalendarDayState.Work);
	stateName: KnockoutComputed<string>;
	isCorrect: boolean = false;

	toggleState() {
		let stateIndex = <number>this.state();
		stateIndex++;

		if (stateIndex === 5) {
			stateIndex = 1;
		}

		this.state(stateIndex);
	}

	constructor(calDay: CalendarDay) {
		this.weekIndex = calDay.weekIndex;
		this.dayOfWeek = calDay.dayOfWeek;
		this.dayOfMonth = calDay.dayOfMonth;
		this.isCorrect = true;
		this.state(calDay.state);

		this.stateName = ko.pureComputed<string>(() => {

			switch (this.state()) {
				case CalendarDayState.Work:
					return 'active work';
				case CalendarDayState.DayOff:
					return 'active dayoff';
				case CalendarDayState.Holiday:
					return 'active holiday';
				case CalendarDayState.SickLeave:
					return 'active sickleave';
			}
		});
	}

	
}

class CalendarWeekViewModel {
	days: CalendarDayViewModel[] = [];
	getDay = (index: number) => {
		return ko.utils.arrayFirst(this.days, d => d.dayOfWeek === index) ||
		{
			isCorrect: false,
			stateName: "",
			toggleState: () => {} 
		};
	};

}

class CalendarViewModel {
	year: number = 0;
	month: number = 0;
	days: KnockoutObservableArray<CalendarDayViewModel>;
	weeks: KnockoutComputed<CalendarWeekViewModel[]>;

	constructor(params: CalendarParams) {
		this.year = params.year;
		this.month = params.month;
		this.days = ko.observableArray<CalendarDayViewModel>();
		this.weeks = ko.computed<CalendarWeekViewModel[]>(() => this.getWeeks());

		fetch(`/api/calendar?year=${this.year}&month=${this.month}`)
			.then(response => response.json() as Promise<Calendar>)
			.then(data => {
				this.days(data.days.map(d => {
					return new CalendarDayViewModel(d);
				}));
			});
	}

	getWeeks() {

		let weeks: CalendarWeekViewModel[] = [];

		for (var it = 0; it < 10; it++) {
			let week: CalendarWeekViewModel = new CalendarWeekViewModel();

			week.days = this.days().filter(d => d.weekIndex === it);

			if (week.days.length) {
				weeks.push(week);
			} else {
				break;
			}
		}


		return weeks;
	}
}

export default { viewModel: CalendarViewModel, template: require('./calendar.html') };