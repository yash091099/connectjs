import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateReferralTabStatusService {

  private referralTabStatus = new BehaviorSubject('');
  currentReferralTabStatus = this.referralTabStatus.asObservable();
 
  constructor() {}

  updateReferralTabStatus(message: string) {
  this.referralTabStatus.next(message)
  }
}
