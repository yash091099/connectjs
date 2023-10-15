import { Injectable } from '@angular/core';
import { HttpencapService } from 'src/app/shared/services';
@Injectable({
	providedIn: 'root'
})
export class AppService {

	constructor(
		private _http: HttpencapService
	) { }

	getHtmlForLandingPage(data) {
		return this._http.get('landing-page/getpage', data);
	}
}
