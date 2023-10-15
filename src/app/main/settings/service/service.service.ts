import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpencapService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http:HttpencapService) { }
  private dataSubject = new BehaviorSubject<string>(''); // Initialize with an empty string
  data$: Observable<string> = this.dataSubject.asObservable();
  setData(newData: string) {
    this.dataSubject.next(newData);
  }
  getData(): string {
    return this.dataSubject.value;
  }

getSocialConnection() {
	return this.http.get('social/v1/get');
}
getWalletAddress() {
	return this.http.get('w3Addresses/v1/get/addresses');
}

sendMetamaskNetworkDetails(data: any) {
  return this.http.post('w3Addresses/v1/connect/wallet', data);

}
// sendMetamaskNetworkDetails(data) {
//   return this.http.post('w3Addresses/v1/connect/wallet', data);
// }
updateUserSocialProfile(data) {
	return this.http.patch('social/v1/update/list', data);
}

  imageUpload(data){
    return this.http.put('files/v1/upload/profile',data);
  }

  profileImageUpload(data){
    return this.http.put('uploads/v1/upload/private/file',data);
  }

  updateProfilePic(data){
    return this.http.patch('auth/v1/user/update/profile/picture',data);
  }

  imageUploadForKyc(data){
    return this.http.put('files/v1/upload/kyc',data);
  }

  getProfile(){
    return this.http.get('auth/v1/user/show/profile');
  }

  getUserRating(){
    return this.http.get('auth/v1/get/user/rating');
  }

  getUserInvestorScore(){
    return this.http.get('funds/v1/user/token/points');
  }

  editUser(data){
    return this.http.patch('auth/v1/edit/profile',data);
  }

  saveEmailChanges(data){
    return this.http.patch('auth/v1/email/notify',data);
  }

  getEmailNotification(){
    return this.http.get('auth/v1/email/notify');
  }

  getCountriesList(){
    return this.http.get('auth/v1/countries/list');
  }

  uploadImagesForKyc(data){
    return this.http.patch('auth/v1/user/KYC/request',data);
  }

  getKycDetails(){
    return this.http.get('auth/v1/user/get/KYCDetail');
  }

  changeUserPassword(data) {
    return this.http.patch('auth/v1/reset/password', data);
  }

  /*******************************DOCUSIGN***************************** */

  onAddDocusign(data){
    return this.http.patch('auth/v1/user/add/signedDocument',data);
  }

  /*******************************DOCUSIGN***************************** */

  getSMSBToken(data?){
    return this.http.get('auth/v1/user/get/smsb');
  }

  getLoginDevice(){
	return this.http.get('sessions/v1/count');
  }

  sendOtpToVerifyEmail(data) {
    return this.http.post('auth/v1/user/send/otp/verify/email', data);
  }

  getKycVerifyLink(data?) {
    return this.http.get('auth/v1/get/faceki/kyc/link', data);
  }

  getKycVerifyLinkByToken(data) {
    return this.http.post('https://sdk.faceki.com/kycverify/api/kycverify/kyc-verify-link', data);
  }

  getFacekiAuthorizationToken(data?){
    return this.http.get('https://sdk.faceki.com/auth/api/access-token',data);
  }

  getFacekiKycDetailsByLink(data?){
    return this.http.get('https://sdk.faceki.com/kycverify/api/kycverify/link',data);
  }

  getFacekiKycDetailsByReferenceId(data?){
    return this.http.get('https://sdk.faceki.com/kycverify/api/kycverify/reference',data);
  }

  saveFacekiKycDetails(data) {
    return this.http.post('auth/v1/add/faceki/kyc/details', data);
  }
  

  getFacekiKycDetails(data?){
    return this.http.get('auth/v1/get/kyc/status',data);
  }

  getKycDetailsByLinkId(data?){
    return this.http.get('auth/v1/get/kyc/status/by/link',data);
  }

}
