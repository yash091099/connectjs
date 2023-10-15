import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  set _id(id: string) {
		localStorage.setItem('_id', id);
	}

	get _id() {
		return localStorage.getItem('_id');
	}

	set token(id: string) {
		localStorage.setItem('token', id);
	}

	get token() {
		return localStorage.getItem('token');
	}

	get user() {
		return localStorage.getItem('_u');
	}
}
