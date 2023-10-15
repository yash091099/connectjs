import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class JwtHelperServices {

  constructor(public jwtHelper: JwtHelperService) { }
  	get token() {
		return this.jwtHelper.tokenGetter();
	}

	get isTokenExpired() {
		return this.jwtHelper.isTokenExpired(this.token);
	}

	get tokenData() {
		return this.jwtHelper.decodeToken(this.token);
	}

	get tokenExpirationTime() {
		return this.jwtHelper.getTokenExpirationDate(this.token);
	}
}
