import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError as _throw } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class HttpencapService {

	constructor(private http: HttpClient) { }

	public getAll(url: string): Observable<any> {
		return this.http.get(url)
			.pipe(
				map((response) => {
					return response;
				}), catchError((e: any) => {
					return _throw(e);
				}),
			);
	}
	public get(url: string, data?: any, options?:any): Observable<any> {
		let optionToSend :any= {
		  params:data
		}
		if(options?.responseType){
		  optionToSend.responseType = options?.responseType
		}
		return this.http.get(url,optionToSend )
		  .pipe(
			map((response) => {
			  return response;
			}), catchError((e: any) => {
			  return _throw(e);
			}),
		  );
	  }
	public patch(url: string, body: any, options?: any): Observable<any> {
		return this.http.patch(url, body, options)
			.pipe(
				map((response) => {
					return response;
				}), catchError((e: any) => {
					return _throw(e);
				}),
			);
	}
	public post(url: string, body: any, options?: any): Observable<any> {
		return this.http.post(url, body, options)
			.pipe(
				map((response) => {
					return response;
				}), catchError((e: any) => {
					return _throw(e);
				}),
			);
	}

	public put(url: string, body: any): Observable<any> {
		return this.http.put(url, body)
			.pipe(
				map((response) => {
					return response;
				}), catchError((e: any) => {
					return _throw(e);
				}),
			);
	}

	public delete(url: string): Observable<any> {
		return this.http.delete(url)
			.pipe(
				map((response) => {
					return response;
				}), catchError((e: any) => {
					return _throw(e);
				}),
			);
	}

	public getFileData(url: string): Observable<any> {
		return this.http.get(url, { responseType: "arraybuffer" })
			.pipe(
				map((response) => {
					return response;
				}), catchError((e: any) => {
					return _throw(e);
				}),
			);
	}
}
