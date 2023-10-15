import { Injectable } from '@angular/core';

import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
	HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CommonApiService } from './common-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
	providedIn: 'root'
})
export class AppInterceptorService implements HttpInterceptor {

	private isUrlEnabled = false;

	constructor(
		private router: Router,
		private sharedService: CommonApiService,
		private modalService: NgbModal,
	) { 
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		request = request.clone({
			url: environment.baseURL + request.url,
		});

		const token: string = this.sharedService.getToken();
		const user = this.sharedService.getCurrentUserId();

		request = request.clone({
			setHeaders: {
				'x-access-user': user + '',
				'authorization': 'Bearer ' + token + '',
			},
		});

		return next.handle(request)
			.pipe(
				tap((event: HttpEvent<any>) => {
					if (event instanceof HttpResponse) {
						console.log(event, "response")
					}
				}, (err: any) => {
					if (err instanceof HttpErrorResponse) {
						console.log(err, "error 1")
						if (err.statusText == "Unknown Error") {
							err.error.message = "Something Went Wrong";
						}
						if (err.status === 401 || err.status === 403) {
							this.sharedService.logout();
							this.modalService.dismissAll();
						}
					}
				}),
			);
	}

}
