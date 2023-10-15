import { Injectable } from '@angular/core';
import { HttpencapService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public basePath = "auth/v1/";

  constructor(private _http: HttpencapService) { }
  login(data) {
    return this._http.post(this.basePath + 'user/login', data);
  }
  sendSignupOtp(data) {
    return this._http.post(this.basePath + 'user/registry', data);
  }
  verifyGoogleCaptcha(data) {
    return this._http.post(this.basePath + 'user/verify/captcha', data);
  }
  socialUpdate(data) {
    return this._http.patch(this.basePath + 'social/update', data);
  }
  verifyOtp(data) {
    return this._http.post(this.basePath + 'user/email/otp/verify', data);
  }

  completeProfile(data) {
    return this._http.post(this.basePath + 'user/signup', data);
  }
  checkForUsername(data) {
    return this._http.get(this.basePath + 'user/unique', data);
  }

  sendForgotPasswordOtp(data) {
    return this._http.post(this.basePath + 'user/forgot/send/link', data);
  }
  verifyForgotPasswordLink(data) {
    return this._http.get(this.basePath + 'user/verify/link/' + data);
  }
  changeForgotPasswordOtp(data) {
    return this._http.post(this.basePath + 'user/forgot/change/password', data);
  }

  verifyLandingPage(data) {
    return this._http.get('affiliates/v1/verify/link', data);
  }
  verifyReferralLink(data) {
    return this._http.get('affiliates/v1/exists/sponsor', data);
  }
  updateLandingPageVisit(data) {
    return this._http.patch('affiliates/v1/updateVisit', data);
  }
  updateReferralLinkVisit(data) {
    return this._http.patch('affiliates/v1/update/visit', data);
  }
  verifyLandingReport(data) {
    return this._http.get('reportAffiliates/v1/verify/link', data);
  }
  updateLandingReportVisit(data) {
    return this._http.patch('reportAffiliates/v1/updateVisit', data);
  }

  countReportVisitExisting(data) {
    return this._http.post('stats/v1/view', data);
  }
}
