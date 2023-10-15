import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmountService {

  constructor(public router: Router) { }

  private subject = new BehaviorSubject('0');
  private profileImage = new BehaviorSubject('');
  private deposit = new BehaviorSubject('N');
  private packagePurchase = new BehaviorSubject('N');
  private sidebar = new BehaviorSubject('N');
  private profileName = new BehaviorSubject(null);
  private callForFun = new BehaviorSubject(false);
  private hideLoginButton = new BehaviorSubject(false);
  private startTutorial = new BehaviorSubject(false);
  private isSideBarDashboard = new BehaviorSubject(false);
  public showAddMoney: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public enableWallet: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public fetchWallet: BehaviorSubject<boolean> = new BehaviorSubject(false);


  public walletConnection: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showInterest: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public showProfileVerify: BehaviorSubject<boolean> = new BehaviorSubject(false);


  setProfileVerify(message) {
    this.showProfileVerify.next(message);
  }
  getProfileVerify() {
    return this.showProfileVerify.asObservable();
  }

  setMessage(message) {
    this.subject.next(message);
  }
  getMessage() {
    return this.subject.asObservable();
  }
  handlefetchWalletAmount(data) {
    this.fetchWallet.next(data);
  }
  getFetchWallet() {
    return this.fetchWallet.asObservable();
  }
  setShowInterest(data) {
    this.showInterest.next(data);
  }
  getShowInterest() {
    return this.showInterest.asObservable();
  }
  setWalletConnection(data) {
    this.walletConnection.next(data);
  }
  getWalletConnection() {
    return this.walletConnection.asObservable();
  }
  clearMessage() {
    this.subject.next(null);
  }

  setIsSideBarDashboard(message) {
    this.isSideBarDashboard.next(message);
  }
  getIsSideBarDashboarde() {
    return this.isSideBarDashboard.asObservable();
  }

  setImage(image) {
    return this.profileImage.next(image);
  }
  getImage() {
    return this.profileImage.asObservable();
  }

  setPayment(message) {
    this.deposit.next(message);
  }
  getPayment() {
    return this.deposit.asObservable();
  }

  setStartTutorial(message) {
    this.startTutorial.next(message);
  }
  getStartTutorial() {
    return this.startTutorial.asObservable();
  }

  setWalletAmount(message) {
    this.packagePurchase.next(message);
  }
  getWalletAmount() {
    return this.packagePurchase.asObservable();
  }

  setSidebar(message) {
    this.sidebar.next(message);
  }
  getSidebar() {
    return this.sidebar.asObservable();
  }

  setProfileName(message) {
    this.profileName.next(message);
  }
  getProfileName() {
    return this.profileName.asObservable();
  }

  setCallForFun(message) {
    this.callForFun.next(message);
  }
  getCallForFun() {
    return this.callForFun.asObservable();
  }

  setHeaderLoginButton(message) {
    this.hideLoginButton.next(message);
  }
  getHeaderLoginButton() {
    return this.hideLoginButton.asObservable();
  }
  public handleshowAddMoney(data): void {
    console.log('_+_+_+_+_+Calling obs', data)
    this.showAddMoney.next(data);
  }

  public getShowAddMoney() {
    console.log("getting data")
    return this.showAddMoney.asObservable();
  }
  public handleEnableWallet(data): void {
    this.enableWallet.next(data);
  }

  public getEnableWallet() {
    console.log("getting data")
    return this.enableWallet.asObservable();
  }
}
