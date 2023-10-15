import { Injectable } from '@angular/core';
import { HttpencapService } from 'src/app/shared/services';
@Injectable({
  providedIn: 'root'
})
export class AcceleratorService {

  constructor(private http: HttpencapService) { }

  fetchStartUps(data?) {
    return this.http.get("startup/v1/get/startup", data);
  }

  fetchProjects(data?) {
    return this.http.get("startup/v1/get/startup", data);
  }

  createTransaction(data?) {
    return this.http.post("funds/v1/create/startup/transaction", data);
  }

  fetchProjectWallet(data?) {
    return this.http.get("funds/v1/user/startup/balance", data);
  }

  fetchTokenTransaction(data?) {
    return this.http.get("funds/v1/user/startup/purchase", data);
  }

  fetchWithdrawal(data?) {
    return this.http.get("funds/v1/user/withdrawal", data);
  }

  getKYCUser(data) {
    return this.http.get("startup/v1/get/KYCuser", data)
  }

  checkUserKyc(data?) {
    return this.http.post("funds/v1/KYC/user", data);
  }

  getWalletAddress() {
    return this.http.get("funds/v1/user/walletAddress");
  }

  updateWalletAddress(data) {
    return this.http.patch("funds/v1/user/update/walletAddress", data);
  }

  createWithdrawal(data) {
    return this.http.post("funds/v1/create/withdrawal/transaction", data);
  }

  requestForMoreToken(data) {
    return this.http.post('startup/v1/add/tokenRequest', data);
  }

  getSignedUrl(data) {
    return this.http.get('files/v1/getSigned/media', data);
  }

  getTokenInterest(data) {
    return this.http.get('funds/v1/user/token/interest', data)
  }

  getCommissionAmount(data?) {
	  return this.http.get('funds/v1/user/purchase/commission', data)
	}

  /*******************************DOCUSIGN***************************** */

  onAddDocusign(data) {
    return this.http.patch('funds/v1/user/add/signedDocument', data);
  }

  /*******************************DOCUSIGN***************************** */
  withdrawStartupPurchase(data) {
    return this.http.post('funds/v1/withdraw/startup/purchase', data);
  }
  fetchDefaultStartups(data) {
    return this.http.get('startup/v1/default/list',data);
  }
  getStartupDataAccordingToStatus() {
    return this.http.get('startup/v1/get/startup/status/wise');
  }

  fetchStartupDescription(data){
	  return this.http.get('',data);
  }


}
