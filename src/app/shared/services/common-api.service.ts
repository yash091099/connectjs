import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpencapService } from './httpencap.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root'
})
export class CommonApiService {

	public isUserLogin = false;

	public isAdmin = false;
	public currentUser: any;
	public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

	public currentUserId: any;

	public currentProfileImage = null
	constructor(public _http: HttpencapService, public _route: Router, public jwtHelper: JwtHelperService, private _title: Title,
		public toastrService: ToastrService) {
	}

	/************************************ SETTERS & GETTERS SECTION STARTS ************************************/
	public setTitle(title) {
		this._title.setTitle(title);
	}
	public setUserLoggedIn(data): void {
		this.currentUser = data.user;
		window.localStorage.setItem('_u', JSON.stringify(data.user));
		window.localStorage.setItem('token', data.token);
		this.isLoggedIn.next(true);
	}

	public unsetUserLoggedIn(): void {
		this.isLoggedIn.next(false);
	}



	public isUserLoggedIn(): Boolean {
		let user = window.localStorage.getItem('_u');
		let token = window.localStorage.getItem('token');
		this.currentUser = (user) ? JSON.parse(user) : {};
		if (Object.keys(this.currentUser).length && token) {
			this.isLoggedIn.next(true);
			return true;
		} else {
			this.isLoggedIn.next(false);
			return false;
		}
	}

	public getUserLoggedIn() {
		return this.isUserLogin;
	}

	public getUserRole(): string {
		return this.currentUser.role.toString().toLowerCase();
	}

	public getToken(): string {
		return window.localStorage.getItem('token');
	}

	public getCurrentUserId(): string {
		let user = window.localStorage.getItem('_u');
		let userObj = JSON.parse(user);
		this.currentUserId = userObj?.accountId;
		return this.currentUserId;
	}

	public getUUid(): string {
		let uuid = this.jwtHelper.decodeToken(window.localStorage.getItem('token')).uuid;
		return uuid;
	}

	public getCurrentUser(): any {
		let user = window.localStorage.getItem('_u');
		return (user) ? (JSON.parse(window.localStorage.getItem('_u'))) : null;
	}

	public errorHandler(error: Response) {
		console.table(error)
		return Observable.throw(error || "Server error");
	}

	public logout(redirect?): void {
		window.localStorage.clear();
		this.currentUser = null;
		this.isLoggedIn.next(false);
		if (!redirect) {
			this._route.navigate(['/auth/login']);
		}
	}
	getLogin() {
		console.log(this.isLoggedIn, this.isLoggedIn.asObservable())
		return this.isLoggedIn.asObservable();
	}


	public getAuthToken(): string {
		return window.localStorage.getItem('token');
	}

	public removeAll(): void {
		window.localStorage.clear();
	}

	public decodeUserFromToken(token) {
		return this.jwtHelper.decodeToken('token');
	}
	public setUserLoginDetails(data) {
		window.localStorage.setItem("loginDetails", data)
	}
	public setCurrentUser(decodedUser) {
		this.isLoggedIn.next(true);
		this.currentUser.id = decodedUser?.id;
		this.currentUser.name = decodedUser?.name;
		this.currentUser.email = decodedUser?.email;
		this.currentUser.username = decodedUser?.username;
		this.currentUser.role = decodedUser?.role;
		decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
		delete decodedUser.role;
	}

	public fetchFileExtention(fileName) {
		return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
	}

	public getSize(fileData) {

		return new Promise(resolve => {
			var img = new Image();
			img.onload = () => {
				let width = img.width;
				let height = img.height;
				resolve({ height: height, width: width });
			};
			img.src = fileData;
		});

	}
	getChainDetails(chain) {
		let chainDetails: any = ''

		switch (chain) {
			case 'POLYGON':
				chainDetails = "Polygon MATIC Chain"
				break;
			case "BEP20":
				chainDetails = 'Binance Smart Chain'
				break;
			default:
				chainDetails = chain
				break;
		}
		return chainDetails
	}
	public copyInfo(data) {
		navigator.clipboard.writeText(data).then(() => {
		}, (err) => {
			this.toastrService.error("Could not copy data", "Please try again!", {
				timeOut: 3000
			});
			console.error('Could not copy data: ', err);
		});
	}

	public logOutApi(data?) {
		return this._http.patch('auth/v1/user/logout', data);
	}
	public withdrawAmount(data?) {
		return this._http.post('withdrawl/v1/add', data)
	}
	createTransaction(data) {
		return this._http.post("funds/v1/create/transaction", data);
	}
	getWalletAmount(data?) {
		return this._http.get("/funds/v1/user/deposit", data);
	}
	redeemCashCoupon(data) {
		return this._http.post("coupons/v1/apply/cash/coupon", data);
	}
	createUserWallet(data) {
		return this._http.post('funds/v1/create/wallet', data)
	}
	getUserWalletDetails() {
		return this._http.get('funds/v1/user/wallet')
	}
	subscribeEmail(data) {
		return this._http.post('auth/v1/register/mail', data)
	}
	registerUserInterest(data) {
		return this._http.post('funds/v1/register/token/interest', data)
	}

	getDeposit(data) {
		return this._http.get('funds/v1/user/deposit',data);
	}
	getMainWalletDebit(data) {
		return this._http.get('funds/v1/user/fund/purchase/debit',data);
	}
	getMainWalletWithDrawal(data) {
		return this._http.get('withdrawl/v1/get/user/without/pagination',data);
	}
	getWithDrawal(data) {
		return this._http.get('withdrawl/v1/get/user',data);
	}
	getMainCredits(data) {
		return this._http.get('funds/v1/user/credit',data);
	}
	getEarningWithdrawalTransactions(data) {
		return this._http.get('withdrawl/v1/get/user/without/pagination',data);
	}
	// getEarningCreditTransactions(data) {
	// 	return this._http.get('walletLogs/v1/user/earning/credit',data);
	// }
	getEarningCreditTransactions(data) {
		return this._http.get('walletLogs/v1/user/credit/logs',data);
	}
	getEarningDebitTransactions(data) {
		return this._http.get('walletLogs/v1/user/earning/debit',data);
	}
}

