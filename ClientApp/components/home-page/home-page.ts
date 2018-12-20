import * as ko from 'knockout';


class HomePageViewModel {
	public reportYear: number;
	public reportMonth: number;

	constructor(params: { reportYear: number, reportMonth: number }) {
		this.reportYear = params.reportYear;
		this.reportMonth = params.reportMonth;
	}
}

export default { viewModel: HomePageViewModel, template: require('./home-page.html') };
