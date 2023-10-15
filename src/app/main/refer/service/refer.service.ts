import { Injectable } from '@angular/core';
import { HttpencapService } from 'src/app/shared/services';
import { Router } from "@angular/router";
@Injectable({
	providedIn: 'root'
})
export class ReferService {

	constructor(public http: HttpencapService, private router: Router) { }

	scrollToElementById(id: string) {
		const element = this.__getElementById(id);
		this.scrollToElement(element);
	}
	private __getElementById(id: string): HTMLElement {
		console.log("element id : ", id);
		const element = document.getElementById(id);
		return element;
	}

	scrollToElement(element: HTMLElement) {
		element.scrollIntoView({ behavior: "smooth" });
	}

	downloadFile(data?) {
		return this.http.get('campaign/v1/export/joined/user', data, { responseType: 'blob' });
	}

	getRefferalLink() {
		return this.http.get('affiliates/v1/default/memberId')
	}
	getRefferedUserList(data?) {
		return this.http.get('auth/v1/users/team', data)
	}
	claimReward(data) {
		return this.http.post('funds/v1/claim/rewards', data)
	}
	getRewardAmount() {
		return this.http.get('funds/v1/user/referral/points')
	}
	updatedReferralLink(data?) {
		return this.http.patch('affiliates/v1/update/memberId', data)
	}
	checkReferralLink(data) {
		return this.http.get('affiliates/v1/unique/memberId', data)
	}

	createCampaign(data?) {
		return this.http.post('campaign/v1/create', data)
	}
	getBannerData(data?) {
		return this.http.post('affiliates/v1/default/link/check', data)
	}

	filterCampaignList(data?) {

		return this.http.get('affiliates/v1/default/link/data', data)
	}
	getlinkCampaignData(data?) {

		return this.http.get('campaign/v1/user/all', data)

	}
	analyticsData(data) {
		return this.http.get('campaign/v1/joined/user', data)
	}
	getReferralArrayDetails(data) {

		return this.http.get('affiliates/v1/campaign/id', data)
	}
	delete(data) {
		return this.http.patch('campaign/v1/delete', data)
	}
	defaultReferral(data) {
		return this.http.get('campaign/v1/default/joined/users', data)
	}
	getUsdWalletLogs(data?) {
		return this.http.get('reports/v1/get/walletlogs', data)
	}
	getCommissionWalletLogs(data?) {
		return this.http.get('walletLogs/v1/user/walletLogs', data)
	}
	getCommissionWithdrawalLogs(data?) {
		return this.http.get('withdrawl/v1/get/user', data)
	}
	getCommissionWalletBalance() {
		return this.http.get('funds/v1/user/commission')
	}
	getTotalEarnings(data?) {
		return this.http.get('funds/v1/user/commission', data)
	}


}