import * as ko from 'knockout';

interface ICalendarParams {
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
	weekIndex = 0;
	dayOfWeek = 0;
	dayOfMonth = 0;
	state = CalendarDayState.Work;
}

class CalendarDayStateInfo {

	count = ko.observable<number>(0);

	constructor(public state: CalendarDayState, public next: CalendarDayState, public name: string, public cssClass: string) {
	}
}

var states: CalendarDayStateInfo[] = [];

states.push(new CalendarDayStateInfo(CalendarDayState.Work, CalendarDayState.DayOff, 'Work', 'work'));
states.push(new CalendarDayStateInfo(CalendarDayState.DayOff, CalendarDayState.SickLeave, 'Day off', 'dayoff'));
states.push(new CalendarDayStateInfo(CalendarDayState.SickLeave, CalendarDayState.Holiday, 'Sick leave', 'sickleave'));
states.push(new CalendarDayStateInfo(CalendarDayState.Holiday, CalendarDayState.Work, 'Holiday', 'holiday'));


function getStateInfo(state: CalendarDayState): CalendarDayStateInfo {
	return ko.utils.arrayFirst(states, (s: CalendarDayStateInfo) => s.state === state);
}

export class CalendarDayViewModel {
	weekIndex = 0;
	dayOfWeek = 0;
	dayOfMonth = 0;
	state = ko.observable(CalendarDayState.Work);
	stateName: KnockoutComputed<string>;
	cssClass: KnockoutComputed<string>;

	toggleState() {
		const state = getStateInfo(this.state());

		this.state(state.next);
	}

	constructor(calDay: CalendarDay) {
		this.weekIndex = calDay.weekIndex;
		this.dayOfWeek = calDay.dayOfWeek;
		this.dayOfMonth = calDay.dayOfMonth;
		this.state(calDay.state);

		this.stateName = ko.computed<string>(() => {
			return `(${getStateInfo(this.state()).name})`;
		});

		this.cssClass = ko.computed<string>(() => {
			return `day ${getStateInfo(this.state()).cssClass}`;
		});
	}
}

class CalendarWeekViewModel {
	days: CalendarDayViewModel[] = [];
	getDay = (index: number) => {
		return ko.utils.arrayFirst<CalendarDayViewModel>(this.days, d => d.dayOfWeek === index) ||
			{
				stateName: "",
				toggleState: () => { }
			};
	};
}

export class CalendarViewModel {
	year = 0;
	month = 0;
	days: KnockoutObservableArray<CalendarDayViewModel>;
	weeks: KnockoutComputed<CalendarWeekViewModel[]>;
	states: CalendarDayStateInfo[];

	constructor(params: ICalendarParams) {
		this.year = params.year;
		this.month = params.month;
		this.days = ko.observableArray<CalendarDayViewModel>();
		this.weeks = ko.computed<CalendarWeekViewModel[]>(() => this.getWeeks());
		this.states = states;

		fetch(`/api/calendar?year=${this.year}&month=${this.month}`)
			.then(response => response.json() as Promise<Calendar>)
			.then(data => {
				this.days(data.days.map(d => {

					const cdvm = new CalendarDayViewModel(d);

					cdvm.state.subscribe(() => this.onDayChanged());

					return cdvm;
				}));

				this.onDayChanged();
			});
	}

	onDayChanged() {
		for (let state of this.states) {
			const daysInState = ko.utils.arrayFilter(this.days(), d => d.state() === state.state).length;
			state.count(daysInState);
		}
	}

	getWeeks() {
		const weeks: CalendarWeekViewModel[] = [];

		for (var it = 0; it < 10; it++) {
			const week = new CalendarWeekViewModel();

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