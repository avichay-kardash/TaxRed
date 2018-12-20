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

class CalendarDayStateInfo {

	count: KnockoutObservable<number> = ko.observable<number>(0);

	constructor(public state: CalendarDayState, public next: CalendarDayState, public name: string, public cssClass: string) {

	}

}

var states: CalendarDayStateInfo[] = [];

states.push(new CalendarDayStateInfo(CalendarDayState.Work, CalendarDayState.DayOff, 'Work', 'work'));
states.push(new CalendarDayStateInfo(CalendarDayState.DayOff, CalendarDayState.SickLeave, 'Day off', 'dayoff'));
states.push(new CalendarDayStateInfo(CalendarDayState.SickLeave, CalendarDayState.Holiday, 'Sick leave', 'sickleave'));
states.push(new CalendarDayStateInfo(CalendarDayState.Holiday, CalendarDayState.Work, 'Holiday', 'holiday'));


function getStateInfo(state: CalendarDayState) {
	return ko.utils.arrayFirst(states, s => s.state === state);
}

class CalendarDayViewModel {
	weekIndex: number = 0;
	dayOfWeek: number = 0;
	dayOfMonth: number = 0;
	state: KnockoutObservable<CalendarDayState> = ko.observable(CalendarDayState.Work);
	stateName: KnockoutComputed<string>;
	isCorrect: boolean = false;

	toggleState() {
		let state = getStateInfo(this.state());

		this.state(state.next);
	}

	constructor(calDay: CalendarDay) {
		this.weekIndex = calDay.weekIndex;
		this.dayOfWeek = calDay.dayOfWeek;
		this.dayOfMonth = calDay.dayOfMonth;
		this.isCorrect = true;
		this.state(calDay.state);

		this.stateName = ko.pureComputed<string>(() => {

			let state = getStateInfo(this.state());

			return 'active ' + state.cssClass;
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
				toggleState: () => { }
			};
	};

}

class CalendarViewModel {
	year: number = 0;
	month: number = 0;
	days: KnockoutObservableArray<CalendarDayViewModel>;
	weeks: KnockoutComputed<CalendarWeekViewModel[]>;
	states: CalendarDayStateInfo[];

	constructor(params: CalendarParams) {
		this.year = params.year;
		this.month = params.month;
		this.days = ko.observableArray<CalendarDayViewModel>();
		this.weeks = ko.computed<CalendarWeekViewModel[]>(() => this.getWeeks());
		this.states = states;

		fetch(`/api/calendar?year=${this.year}&month=${this.month}`)
			.then(response => response.json() as Promise<Calendar>)
			.then(data => {
				this.days(data.days.map(d => {

					let cdvm = new CalendarDayViewModel(d);

					cdvm.state.subscribe(() => this.onDayChanged());

					return cdvm;
				}));

				this.onDayChanged();
			});
	}

	onDayChanged() {

		for (let state of this.states) {
			let daysInState = ko.utils.arrayFilter(this.days(), d => d.state() === state.state).length;
			state.count(daysInState);
		}
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