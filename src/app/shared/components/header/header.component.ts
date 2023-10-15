import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { CommonApiService, LoaderService } from "../../services";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AmountService } from "../../services/amount.service";
import { WalletService } from "src/app/main/wallet/services/wallet.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { DecimalPipe } from '../../pipe/decimal.pipe';
import { environment } from '../../../../environments/environment';
import { SettingService } from "src/app/main/settings/service/service.service";
import { FormBuilder } from '@angular/forms';
import { Constants } from "src/app/config/constant";
import { Messages } from "src/app/config/message";
import { AcceleratorService } from "src/app/main/accelerator/services/accelerator.service";

declare var $: any;
@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.css"],
	providers: [DecimalPipe]
})
export class HeaderComponent implements OnInit {
	/******EventEmmiter******/
	disableAddAmountButton:boolean=false;
	@Input() isLoggedIn;
	@ViewChild("purchasePopupSecond", { static: true }) addFund: ElementRef;
	/***********String***********/
	public name = "User";
	public errorMessage = "";
	public successMessage = "";
	public selectedPaymentMethod = 'Choose payment method';
	profilePictureSrc:any ="";
	/***********Boolean***********/
	public isCashCouponScreen = false;
	public gateResponse = false;
	public isLoggedInObs = false;
	public isSideBarProjects = true;
	walletConnected = false
	buttonClicked = false;
	showDropDown = false;
	public kycApproved = false;
	showProfileVerify = false;
	/***********Object***********/
	public gatewayData: any = {};
	/***********integer***********/
	public amountToAdd = 0;
	/***********Variable***********/
	subscription: Subscription;
	public modalRef: NgbModalRef;
	profileImage = null;
	public couponData: any = null;
	public coinName = null;
	amount = null;
	public user = null;
	public paymentModes = environment.depositPayModes
	/***********Constants***********/
	constants = Messages.CONST_MSG
	
	walletAddress:any;
	constructor(
		public modalService: NgbModal,
		public decimalPipe: DecimalPipe,
		public toastrService: ToastrService,
		public loaderService: LoaderService,
		public sharedService: CommonApiService,
		public walletService: WalletService,
		public router: Router,
		public settingService: SettingService,
		public amountService: AmountService,
		public fb: FormBuilder,
		public acceleratorService: AcceleratorService,
		private service: SettingService,
		
	) { }

	ngOnInit(): void {
		this.service.data$.subscribe((newData) => {
			this.getWalletAddress();
			console.log(newData,'✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎___________++✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎');
		  });
	
		  
	this.getWalletAddress()
		this.getProfileDetails();
		$(function () {
			$(window).on("scroll", function () {
				if ($(window).scrollTop() > 50) {
					$("nav").addClass("header-bg");
				} else {
					$("nav").removeClass("header-bg");
				}
			});
			$(function () {
				$(document).click(function (event) {
					$('.navbar-collapse').collapse('hide');
				});
			});
		});
		$(document).ready(function () {
			$('.menu-btn').click(function(){
				console.log('i am workin header !!!!!!!!!!')
				
				$('#wrapper').addClass("margin-left-250");
			  });
			});  
		this.sharedService.isUserLoggedIn();
		this.sharedService.getLogin().subscribe(
			(res) => {
				this.isLoggedIn = res;
			},
			(err) => {
				console.log("Error occured while calling observable", err);
			}
		);
		if (this.isLoggedIn) {
			let userDetails = this.sharedService.getCurrentUser();
			this.name = userDetails.name;
			this.user = userDetails
			this.showProfileVerify = userDetails?.emailVerified
			this.amountService.setProfileVerify(userDetails?.emailVerified);
			this.amountService.getMessage().subscribe((res: any) => {
				this.amount = this.decimalPipe.transform(res)
			})
			this.getWalletAmount();
			this.amountService.getWalletConnection().subscribe((res) => {
				this.walletConnected = res
			})
			this.amountService.getProfileVerify().subscribe((res) => {
				this.showProfileVerify = res
			})
			console.log("show profile verify",this.showProfileVerify);
			this.getProfile();
			this.setImage();
			this.observerProfileImage();
			this.getNamefromProfileUpdate();
			this.observerSideBar();
			this.checkUserKyc();
			if (this.walletConnected) {
				this.getWalletAmountAfterPurchase();
			}
		}
		this.amountService.getShowAddMoney().subscribe((res) => {
			console.log("header called value>", res)
			if (res) {
				this.openAddFund()
			}
		})
		this.amountService.getFetchWallet().subscribe(response => {
			if (response) {
				this.getWalletAmount()
			}
		});
		this.amountService.getHeaderLoginButton().subscribe(response => {
			if (response) {
				this.isLoggedInObs = true;
			} else {
				this.isLoggedInObs = false;
			}
		});
		$(function () {
			$(window).on("scroll", function () {
				if ($(window).scrollTop() > 50) {
					$("nav").addClass("header-bg");
				} else {
					$("nav").removeClass("header-bg");
				}
			});
			$(function () {
				$(document).click(function (event) {
					$('.navbar-collapse').collapse('hide');
				});
			});
		});
		if (!this.walletConnected) {
			this.enableWallet()
		}
	}


	 getWalletAddress(){
		this.loaderService.show();
		this.service.getWalletAddress().subscribe(response => {
			this.loaderService.hide();
			if (response.error) {
				console.log('Error : ', response.error);
			} else {
				this.walletAddress=response?.data[0]?.walletAddress||[];
				console.log('Header is updated with wallet address:', this.walletAddress);
				console.log('header is calling ✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎✈︎')
			}
		}, (error) => {
			this.toastrService.clear();
			this.toastrService.error(this.constants.SOMETHING_WENT_WRONG, this.constants.ERROR, {
				timeOut: 3000,
			});
			console.log("Server Error : ", error);
		});
	}

    
	/**
	 * @description: used to get profile details
	 */
	getProfileDetails() {
		this.service.getProfile().subscribe(
			(response) => {
				this.loaderService.hide();
				if (response?.error) {
					console.log("Error");
				} else {
					let userDetails = JSON.parse(localStorage.getItem('_u'));
					userDetails.emailVerified =  response?.data?.emailVerified
					localStorage.setItem('_u', JSON.stringify(userDetails))
					this.profilePictureSrc = response?.data?.imagePreview
				}
			},
			(error) => {
				console.log("Server Error: ", error);
			}
		);
	}

	/**
	 * @description: used to enable wallet
	 */
	enableWallet() {
		this.amountService.getEnableWallet().subscribe((res) => {
			if (res) {
				this.creatUserWallet()
			}
		})
	}

	/**
	 * @description: used to create user wallet
	 */
	creatUserWallet() {
		let dataToSend = {
			userId: this.user?._id
		}
		this.loaderService.show();
		this.sharedService.createUserWallet(dataToSend).subscribe((res) => {
			this.loaderService.hide()
			if (res?.status == 200) {
				this.walletConnected = true
				this.amountService.setWalletConnection(true)
				this.getWalletAmount()
				this.toastrService.success(this.constants.WALLET_CREATED_SUCCESSFULLY);
				window.location.reload();
			} else {
				this.toastrService.info(res?.message || this.constants.SOMETHING_WENT_WRONG, this.constants.PLEASE_TRY_AGAIN);
			}
		}, (error) => {
			this.loaderService.hide()
			console.log(error);
			this.toastrService.info(error?.message || this.constants.SOMETHING_WENT_WRONG, this.constants.PLEASE_TRY_AGAIN)
		})
	}
	ngOnDestroy() {
		localStorage.removeItem('interestFor')
	}
	/**
	 * @description: used to navigate to the wallet withdrawals
	 */
	goToWallet() {
		this.router.navigate(['/wallet/withdrawals']);
	}

	/**
	 * @description: used to get the profile picture and kyc requested
	 */
	getProfile() {
		this.settingService.getProfile().subscribe((response) => {
			if (response.error) {
				console.log("getProfile Error : ", response);
			} else {
				console.log(response);
				this.profileImage = response?.data?.profilePicture || './../../../assets/images/user.png';
				let edit_u = JSON.parse(localStorage.getItem('_u'));
				if (response?.data?.KYCRequested) {
					edit_u.profilePicture = this.profileImage;
				}
				if (edit_u && this.profileImage) {
					edit_u.KYCRequested = response?.data?.KYCRequested
					localStorage.setItem('_u', JSON.stringify(edit_u));
				}
			}
		});
	}

	/**
	 * @description: used to get the profile name
	 */
	getNamefromProfileUpdate() {
		this.amountService.getProfileName().subscribe(response => {
			if (response) {
				this.name = response;
			}
		});
	}

	/**
	 * @description: used to get the wallet amount after purchase
	 */
	getWalletAmountAfterPurchase() {
		this.amountService.getWalletAmount().subscribe(response => {
			if (response == 'Y') {
				this.amountService.setWalletAmount('N');
				this.getWalletAmount()
			}
		})
	}

	/**
	 * @description: used to set the profile image to observable
	 */
	setImage() {
		this.profileImage = JSON.parse(localStorage.getItem("_u")).profilePicture || './../../../assets/images/user.png';
		this.amountService.setImage(this.profileImage);
	}

	/**
	 * @description: used to get the observer profile image
	 */
	observerProfileImage() {
		this.subscription = this.amountService.getImage().subscribe((profileImage) => {
			this.profileImage = profileImage;
		});
	}

	/**
	 * @description: used to get the sidebar observer
	 */
	observerSideBar() {
		this.amountService.getSidebar().subscribe((sideBar) => {
			if (sideBar == 'Projects') {
				this.isSideBarProjects = false
			} else {
				this.isSideBarProjects = true;
			}
		});
	}

	/**
	 * @description: used to logout the panel from this device or all devices
	 * @param thisDevice 
	 */
	logout(thisDevice) {
		this.closeLogOutModal();
		this.isLoggedInObs = false;
		this.isLoggedIn = false;
		let dataToSend = {
			token: window.localStorage.getItem('token'),
			userId: this.user._id,
			logoutSpecific: thisDevice
		}
		this.sharedService.logOutApi(dataToSend).subscribe((response) => {
		}, (error) => {
			console.log(error);
		});
		this.sharedService.logout();
	}

	/**
	 * @description: used to redeem cash coupon
	 */
	redeemCashCoupon() {
		if (!this.couponData) {
			this.error(this.constants.COUPON_CANNOT_BE_BLANK)
			return;
		}
		let data = {
			"name": this.couponData
		};
		this.loaderService.show();
		this.sharedService.redeemCashCoupon(data).subscribe(
			(response) => {
				if (response.error) {
					this.loaderService.hide();
					console.error(response.message);
					this.toastrService.clear();
					this.toastrService.error(response.message, this.constants.ERROR, {
						timeOut: 3000,
					});
				} else {
					this.amountService.setPayment('Y');
					this.toastrService.success(this.constants.COUPON_REDEEMED_SUCCESSFULLY, this.constants.COUPON, { timeOut: 2000 })
					this.loaderService.hide();
					this.closePopup();
					this.getWalletAmount();
				}
			},
			(error) => {
				this.loaderService.hide();
				console.error(error);
				this.toastrService.clear();
				this.toastrService.error(error.error.message, this.constants.ERROR, {
					timeOut: 3000,
				});
			}
		);
	}
	/**
	 * @description: used to get the wallet amount and set the wallet amount to observer
	 */
	getWalletAmount() {
		this.walletService.getWallet().subscribe(response => {
			if (response.error) {
				console.log('Error');
			} else {
				this.amountService.setWalletConnection(response.data?.walletExist)
				if (response.data.balance) {
					this.amountService.setMessage(this.decimalPipe.transform(response.data.balance.$numberDecimal || response.data.balance));
				} else {
					this.amount = null
				}
			}
		}, error => {
			console.log('Server Error : ', error);
		});
	}
	/**
	 * @description: used to call the add fund popup
	 */
	public openAddFund() {
		this.openPopupOne(this.addFund)
	}

	/**
	 * @description: used to open the add fund popup
	 * @param content: html content popup 
	 */
	openPopupOne(content) {
		this.gateResponse = false;
		this.isCashCouponScreen = false;
		this.gatewayData = {};
		this.gateResponse = false;
		this.amountToAdd = null;
		this.couponData = null;
		this.coinName = null;
		this.modalRef = this.modalService.open(content, { centered: true, size: 'md', windowClass:"withdrawl-popup", backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
	}

	/**
	 * @description: used to create fund transaction
	 */
	createTransaction() {
		this.buttonClicked = false
		if (this.amountToAdd) {
			if (this.amountToAdd < Constants.MIN_DEPOSIT_AMOUNT) {
				this.error('Amount must be greater than or equal to ' + Constants.MIN_DEPOSIT_AMOUNT);
				return;
			} else {
				this.error('');
			}
		} else {
			this.error(this.constants.ENTER_AMOUNT);
			return;
		}
		console.log(this.coinName)
		if (!this.coinName) {
			if (this.coinName != 0) {
				this.error(this.constants.SELECT_COIN);
				return;
			}
		} else {
			this.error('');
		}
		let dataToSend: any = {
			token: this.paymentModes[this.coinName].value,
			amount: this.amountToAdd,
			type: "deposit",
			paymode: this.paymentModes[this.coinName].name,
		};
		if (!dataToSend.paymode) {
			this.error('Paymode blank');
			return;
		}
		if (localStorage.getItem('interestFor')) {
			dataToSend.interestFor = localStorage.getItem('interestFor')
		}
		this.disableAddAmountButton=true;
		this.loaderService.show();
		this.sharedService.createTransaction(dataToSend).subscribe(
			(response) => {
				this.loaderService.hide();
				if (response.error) {
					this.disableAddAmountButton=false;
					console.error(response.message);
					this.error(response.message || this.constants.SOME_ERROR_OCCURED);
				} else {
					if (localStorage.getItem('interestFor')) {
						this.registerInterest(localStorage.getItem('interestFor'))
					}
					this.disableAddAmountButton=false;

					this.gateResponse = true;
					this.gatewayData = response.data;
					this.getWalletAmount();
					this.amountService.setPayment('Y');
				}
			},
			(error) => {
				this.disableAddAmountButton=false;
				this.loaderService.hide();
				console.error(error);
				this.error(error.error.message || this.constants.SERVER_ERROR);
				this.toastrService.clear();
				this.toastrService.error(error.error.message, this.constants.ERROR, {
					timeOut: 3000,
				});
			}
		);
	}

	/**
	 * @description: used to register user interest
	 * @param token 
	 */
	registerInterest(token) {
		let dataToSend = {
			symbol: token,
			amount: this.amountToAdd
		}
		this.sharedService.registerUserInterest(dataToSend).subscribe((res) => {
			if (res.error) {
				console.log(res?.message)
			} else {
				this.amountService.setShowInterest(true)
			}
		}, (error) => {
			console.log(error)
		})
	}

	/**
	 * @description: used to close the qr code popup
	 * @param type 
	 */
	closePopupPayment(type) {
		this.buttonClicked = true
		let message = "";
		if (type == 1) {
			message = this.constants.TRANSACTION_SUCCESSFULL;
			this.toastrService.success(message, this.constants.SUCCESS, { timeOut: 2000 });
		} else if (type == 2) {
			message = this.constants.INVOICE_SAVED;
			this.toastrService.success(message, this.constants.SUCCESS, { timeOut: 2000 });
		} else {
			message = this.constants.INVOICE_CANCELLED_AUTOMATICALLY;
			this.toastrService.clear();
			this.toastrService.error(message, this.constants.ERROR, {
				timeOut: 3000,
			});
		}
		let that = this;
		setTimeout(function () {
			that.modalService.dismissAll();
			this.buttonClicked = false
		}, 2000);
	}

	/**
	 * @description: used to close add fund modal and reset variables
	 */
	closePopup() {
		this.disableAddAmountButton=false
		this.selectedPaymentMethod = 'Choose payment method'
		this.showDropDown = false;
		this.modalService.dismissAll();
		this.error('')
		this.coinName = null
		localStorage.removeItem('interestFor')
		this.isCashCouponScreen = false;
	}
	/**
	 * @description: used to set the error message
	 * @param message 
	 */
	error(message) {
		this.errorMessage = message;
		this.successMessage = "";
	}
	/**
	 * @description: used to set the success message
	 * @param message 
	 */
	success(message) {
		this.successMessage = message;
		this.errorMessage = "";
	}

	/**
	 * @description: on change function of add fund amount
	 */
	checkFundAmount() {
		if (!this.amountToAdd) {
			this.error(this.constants.ENTER_AMOUNT);
		} else {
			if (this.amountToAdd < Constants.MIN_DEPOSIT_AMOUNT) {
				this.error('Amount must be greater than or equal to ' + Constants.MIN_DEPOSIT_AMOUNT);
				return;
			}
			else if (this.amountToAdd > 1000000000) {
				this.error(this.constants.MAX_LIMIT);
			} else {
				this.error('')
			}
		}
	}

	/**
	 * @description: used to reset error message
	 * @param value 
	 */
	resetErrorMessage(value) {
		this.coinName = value
		this.selectedPaymentMethod = `${this.paymentModes[value].name} (${this.paymentModes[value].subName})`
		this.error('')
	}

	/**
	 * @description: on change function of fund amount
	 * @param $event 
	 */
	checkInputValue($event) {
		if (!(($event.keyCode > 95 && $event.keyCode < 106) ||
			($event.keyCode > 47 && $event.keyCode < 58) ||
			$event.keyCode == 8 || $event.keyCode == 190)) {
			return false;
		}
	}

	/**
	 * @description: used to close logout modal
	 */
	closeLogOutModal() {
		this.modalService.dismissAll()
	}

	/**
	 * @description: used to show/hide payment dropdown
	 */
	handleDropDown(){
		this.showDropDown = !this.showDropDown
	}

	/**
	 * @description: used to check user kyc is approved or not
	 */
	checkUserKyc() {
		this.acceleratorService.checkUserKyc().subscribe(response => {
			if (response) {
				this.kycApproved = true;
			}
		}, error => {
			console.log("Server Error", error);
		})
	}
	connectWallet() {
		
		this.router.navigate(['settings/wallet'])
		// this.modalService.open(walletConnectPopup, { centered: true, size: 'md', windowClass:"wallet-connect-popup", backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
	}

}
