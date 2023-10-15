import { Injectable } from '@angular/core';
import { HttpencapService } from 'src/app/shared/services';

@Injectable({
	providedIn: 'root'
})
export class WalletService {

	constructor(private http: HttpencapService) { }

	getPurchase(data) {
		return this.http.get('funds/v1/user/purchase', data);
	}
	getDeposit(data) {
		return this.http.get('funds/v1/user/deposit', data);
	}

	getWithDrawal(data) {
		return this.http.get('withdrawl/v1/get/user', data);
	}

	getWallet() {
		return this.http.get('funds/v1/user/wallet');
	}
	getCommissionWallet(){
		return this.http.get('funds/v1/commission/wallet');
	}

	checkTokenWithdraw(data) {
		return this.http.get('vestingSchedules/v1/check/withdrawal/enabled', data)
	}

	getVestingSchedule(data) {
		return this.http.get('claimingSchedule/v1/user/all', data)
	}

	getTotalAllocatedToken() {
		return this.http.get('funds/v1/user/wallet')
	}
	
	claimToken(data) {
		return this.http.post('claimingSchedule/v1/user/request/claim', data)
	}

	commissionAmountWithdrawal(data) {
		return this.http.post('withdrawl/v1/commission/wallet/request', data)
	}
	getTokensData() {
		return this.http.get('auth/v1/get/earning/tokens/list')
	}
	getTokensDataForMainWallet() {
		return this.http.get('auth/v1/get/main/tokens/list')
	}
}
