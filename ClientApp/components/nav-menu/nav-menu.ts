import * as ko from 'knockout';
import * as $ from 'jquery';
import { Route, Router } from '../../router';

interface NavMenuParams {
	router: Router;
	userName: string;
}

class NavMenuViewModel {
	public router: Router;
	public route: KnockoutObservable<Route>;
	userName: string;

	constructor(params: NavMenuParams) {
		// This viewmodel doesn't do anything except pass through the 'route' parameter to the view.
		// You could remove this viewmodel entirely, and define 'nav-menu' as a template-only component.
		// But in most apps, you'll want some viewmodel logic to determine what navigation options appear.
		this.router = params.router;
		this.route = this.router.currentRoute;
		this.userName = params.userName;
	}

	private login(): void {
		fetch("/api/account");
	}
}

export default { viewModel: NavMenuViewModel, template: require('./nav-menu.html') };
