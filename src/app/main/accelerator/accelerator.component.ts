import { Component, OnInit } from '@angular/core';
import { CommonApiService, FormValidatorService, LoaderService } from 'src/app/shared/services';
import { AcceleratorService } from './services/accelerator.service';
import { NgbPaginationConfig, NgbModal, NgbModalRef, NgbModalConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AmountService } from 'src/app/shared/services/amount.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/config/message';

@Component({
	selector: 'app-accelerator',
	templateUrl: './accelerator.component.html',
	styleUrls: ['./accelerator.component.css']
})
export class AcceleratorComponent implements OnInit {

	// string varaiable to store the project details
	closeResult = '';
	public succesMessage = "";
	public errorMessage = "";
	previewSignedSignature = ''
	sigText = "";
	previewSignature = "";
	signatureStyle = "class_a";
	selectedClass = "class_a";
	projectDescription = '';
	// Array
	public StartUpArray = [];
	public TransactionArray = [];
	public walletTransaction = [];
	public closeStartUps = [];
	public ongoingStartUps = [];
	public upcomingStartUps = [];
	availableStyles = ["class_a", "class_b", "class_c", "class_d"];
	// Object
	public projectDetails: any = {};
	public projectWalletDetails: any = {};
	public gatewayData: any = {};
	public createdInvoiceData: any = {};
	// boolean
	public gateResponse = false;
	public kycApproved = false;
	public purchaseCrypoActive = false;
	public useWalletToPay = true;
	public withdrawalAmountError = true;
	public requestMoreTokensError = false;
	interestRegistered = false
	walletConnected = false
	showPreviewed = false;
	saleStarted = false;
	saleClosed = false;
	purchaseComplted = false
	validationErrorMsg = null;
	useCommissionWallet = false;
	hideUserInfo = false;
	showSignature = false;
	isDeductionLess = false


	// valiable
	tokenAmount: any
	userTotalTokenCount: any
	saleEndsInDays: any
	selectedTransaction: any
	public userDetails = null;
	public walletAddress = null;
	public openStartUpObj = null;
	public localSymbol = null;
	public ytLink = null;
	private modalRef: NgbModalRef;

	// FormGroup for purchase tokens pop-up
	purchaseTokensForm: FormGroup

	//integer valriable
	public currentPage = 1;
	public currentPageWithdrawal = 1;
	public currnetPageTransaction = 1
	public totalCountWallet = 0;
	public totalCountTransaction = 0;
	public rowsPerPageWallet = 10;
	public rowsPerPageTransaction = 10;
	public withdrawalAmount = 0;
	public sellPercentage = 0;
	public walletAmount: any = 0;
	public tokenCount: any = 0;
	public calculatedAmount = 0;

	/**********commision wallet  *********/
	numberOfTockens: any = 0;
	commissionAmount = 0;
	totalPurchaseAmount = 0;

	/**********PURCHASE AMOUNT *********/
	minimumTokenPurchase = 100;
	maximumTokenPurchase = 500;

	/******CONSTANT********/
	constants = Messages.CONST_MSG


	constructor(
		private toastrService: ToastrService,
		private titleService: Title,
		private _sanitizer: DomSanitizer,
		private loaderService: LoaderService,
		private acceleratorService: AcceleratorService,
		private pageConfig: NgbPaginationConfig,
		private modalService: NgbModal,
		private amountService: AmountService,
		private router: Router,
		private config: NgbModalConfig,
		private sharedService: CommonApiService,
		private fb: FormBuilder,
		private validator: FormValidatorService

	) {
		pageConfig.boundaryLinks = false;
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.createForm();
		this.titleService.setTitle(this.constants.TDX_LAUNCHPAD);
		this.amountService.getShowInterest().subscribe((res) => {
			this.interestRegistered = res
		})
		this.fetchStartUps();
		this.getUserDetails();
		this.amountService.getWalletConnection().subscribe((res) => {
			if (res) {
				this.walletConnected = res;
				this.getAmount();
				this.fetchTokenTransaction();
				this.fetchWithdrawalDetails();
				this.checkUserKyc()
			}
		})

	}

	useCommissionWalletOrNot(e) {
		this.useCommissionWallet = !this.useCommissionWallet;
		if (this.useCommissionWallet) {
			this.totalPurchaseAmount = (Number(this.totalPurchaseAmount) - Number(this.commissionAmount))
		}
		else {
			this.totalPurchaseAmount = this.purchaseTokenAmount.value;
		}
	}

	purchaseButtonEnable() {
		if (this.purchaseTokensForm.valid && this.purchaseTokenAmount.value < Number(this.minimumTokenPurchase)) {
			this.validationErrorMsg = `Minimum amount is $${this.minimumTokenPurchase}`
		} else if (this.purchaseTokensForm.valid && this.purchaseTokenAmount.value > Number(this.maximumTokenPurchase)) {
			this.validationErrorMsg = `Maximum amount is $${this.maximumTokenPurchase}`
		}
		else {
			this.validationErrorMsg = null
		}
		if (this.purchaseTokenAmount.invalid) {
			this.totalPurchaseAmount = 0;
			this.numberOfTockens = null;
			this.commissionAmount = 0;
			return;
		}
		this.getCommissionAmount()
		this.totalPurchaseAmount = this.purchaseTokenAmount.value;
		this.numberOfTockens = Number(this.purchaseTokenAmount.value) / Number(this.openStartUpObj?.sellingAmount.$numberDecimal)
	}

	createForm() {
		this.purchaseTokensForm = this.fb.group({
			purchaseTokenAmount: ['', [Validators.required]]
		})
	}

	get purchaseTokenAmount() { return this.purchaseTokensForm.get('purchaseTokenAmount') }


	ngOnDestroy() {
		localStorage.removeItem('interestFor')
	}

	getUserDetails() {
		this.userDetails = JSON.parse(localStorage.getItem('_u'));
	}

	closePurchasePopUp() {
		this.validationErrorMsg = null;
		this.useCommissionWallet = false;
		this.purchaseTokensForm.reset();
		this.totalPurchaseAmount = 0;
		this.numberOfTockens = null;
		this.commissionAmount = 0;
		this.modalService.dismissAll();
	}

	getInterests(token) {
		let dataToSend = {
			startUp: token
		}
		this.acceleratorService.getTokenInterest(dataToSend).subscribe((res) => {
			if (res.error) {
				console.log(res?.message)
			} else {
				if (res?.data?.exist) {
					this.interestRegistered = true
				}
			}
		}, (error) => {
			console.log(error)
		})
	}

	/**
	* description: set observable to update wallet
	*/
	getAmount() {
		this.amountService.getMessage().subscribe(response => {
			this.walletAmount = response
		});

	}

	fetchStartUps() {
		this.loaderService.show();
		this.acceleratorService.fetchStartUps().subscribe(response => {
			this.loaderService.hide();
			response.data = JSON.parse(atob(response.data))
			this.StartUpArray = response.data;
			console.log(this.StartUpArray, "____________________")
			if (this.StartUpArray.length) {
				this.fetchProjectDetails(this.StartUpArray[0]._id, this.StartUpArray[0].symbol);
				this.getInterests(this.StartUpArray[0].symbol)
			}
		}, error => {
			this.loaderService.hide();
			console.log('Server Error : ', error);
		});
	}

	pageChanged(page, type) {
		if (type == 'token') {
			this.currnetPageTransaction = page;
			this.fetchTokenTransaction();
		}
		else {
			this.currentPageWithdrawal = page;
		}
	}

	fetchTokenTransaction() {
		let data = {
			currentPage: this.currnetPageTransaction
		}
		this.loaderService.show();
		this.acceleratorService.fetchTokenTransaction(data).subscribe(response => {
			this.loaderService.hide();
			this.TransactionArray = response.data?.transactions;
			this.rowsPerPageTransaction = response.data?.pageLimit;
			this.totalCountTransaction = response.data?.transactionCount;
		}, error => {
			this.loaderService.hide();
			console.log('Server Error : ', error);
		});
	}

	fetchWithdrawalDetails() {
		let data = {
			currentPage: this.currentPageWithdrawal
		}
		this.loaderService.show();
		this.acceleratorService.fetchWithdrawal(data).subscribe(response => {
			this.loaderService.hide();
			this.walletTransaction = response.data?.transactions;
			this.rowsPerPageWallet = response.data?.pageLimit;
			this.totalCountWallet = response.data?.transactionCount;
		}, error => {
			this.loaderService.hide();
			console.log('Server Error : ', error);
		});
	}

	fetchProjectDetails(startUp, symbol) {
		this.fetchProjects(startUp);
		this.fetchProjectDescription(startUp);
		this.localSymbol = symbol;
		if (this.walletConnected) {
			this.fetchProjectWallet(symbol);
			this.getWalletAddress();
		}

	}

	fetchProjects(startUp) {
		this.loaderService.show();
		this.closeStartUps = [];
		this.openStartUpObj = null;
		this.sellPercentage = 0;
		this.acceleratorService.fetchProjects({ id: startUp }).subscribe(response => {
			response.data = atob(response.data);
			console.log(response.data, "_______________________")
			this.loaderService.hide();
			this.projectDetails = JSON.parse(response.data);
			console.log('_+_+_+_', this.projectDetails);
			this.sellPercentage = this.projectDetails?.progressPercentage;
			this.ongoingStartUps = this.projectDetails.ONGOING;
			this.upcomingStartUps = this.projectDetails.UPCOMING;
			this.closeStartUps = this.projectDetails.CLOSED;
			let technologies: any = {}
			technologies[this.projectDetails?.symbol] = this.projectDetails?.technology
			if(this.ongoingStartUps?.length){
				if (new Date().getTime() > new Date(this.ongoingStartUps[0]?.openingDate).getTime()) {
					this.saleStarted = true
					if(this.ongoingStartUps[0]?.closingDate){
						if (new Date().getTime() > new Date(this.ongoingStartUps[0]?.closingDate).getTime()) {
							this.saleClosed = true
						} else {
							var Difference_In_Time = new Date(this.ongoingStartUps[0]?.closingDate).getTime() - new Date().getTime();
							this.saleEndsInDays = Difference_In_Time / (1000 * 3600 * 24);
							this.saleEndsInDays = Math.round(this.saleEndsInDays)
						}
					}else{
						this.saleClosed = false;
					}
				}
			}

			if ((this.ongoingStartUps) && (this.ongoingStartUps.length)) {
				this.openStartUpObj = this.ongoingStartUps[0];
				if (this.openStartUpObj.userLimitType == this.constants.TOKEN) {
					this.maximumTokenPurchase = Number(this.openStartUpObj?.maxUserLimit) * this.openStartUpObj?.sellingAmount.$numberDecimal
					this.minimumTokenPurchase = Number(this.openStartUpObj?.minUserLimit) * this.openStartUpObj?.sellingAmount.$numberDecimal
				} else {
					this.maximumTokenPurchase = this.openStartUpObj?.maxUserLimit
					this.minimumTokenPurchase = this.openStartUpObj?.minUserLimit
				}
			} else if(this.upcomingStartUps && this.upcomingStartUps?.length) {
				if (this.upcomingStartUps?.length) {
					this.saleStarted = false;
					this.saleClosed = false;
					this.openStartUpObj = this.upcomingStartUps[0];
					if (this.openStartUpObj.userLimitType == this.constants.TOKEN) {
						this.maximumTokenPurchase = Number(this.openStartUpObj?.maxUserLimit) * this.openStartUpObj?.sellingAmount.$numberDecimal
						this.minimumTokenPurchase = Number(this.openStartUpObj?.minUserLimit) * this.openStartUpObj?.sellingAmount.$numberDecimal
					} else {
						this.maximumTokenPurchase = this.openStartUpObj?.maxUserLimit
						this.minimumTokenPurchase = this.openStartUpObj?.minUserLimit
					}
				}
			}else{
				this.openStartUpObj = this.closeStartUps[0];
				this.saleStarted = true;
				this.saleClosed = true;
					if (this.openStartUpObj.userLimitType == this.constants.TOKEN) {
						this.maximumTokenPurchase = Number(this.openStartUpObj?.maxUserLimit) * this.openStartUpObj?.sellingAmount.$numberDecimal
						this.minimumTokenPurchase = Number(this.openStartUpObj?.minUserLimit) * this.openStartUpObj?.sellingAmount.$numberDecimal
					} else {
						this.maximumTokenPurchase = this.openStartUpObj?.maxUserLimit
						this.minimumTokenPurchase = this.openStartUpObj?.minUserLimit
					}
			}
			this.projectDetails.supplyTokenPercent = (this.openStartUpObj?.supplyToken / this.projectDetails?.totalSupply) * 100
			this.ytLink = 'about:blank';
			if (this.projectDetails.ytlink != undefined) {
				this.ytLink = this.projectDetails.ytlink;
				let videoId = this.ytLink?.split('v=')[1];
				let afterRemovingNewPart = videoId?.split('&ab')[0]
				this.ytLink = 'https://www.youtube.com/embed' + `/${afterRemovingNewPart}`;
				this.ytLink = this._sanitizer.bypassSecurityTrustResourceUrl(this.ytLink);
			}
		}, error => {
			this.loaderService.hide();
		});
	}

	getUnsignedKycDocs(userKycDocs) {
		let data = userKycDocs;
		return new Promise((resolve, reject) => {
			this.acceleratorService.getSignedUrl(data).subscribe(response => {
				resolve(response);
			}, err => {
				reject({ error: true, err: err });
			});
		});
	}


	checkUserKyc() {
		this.acceleratorService.checkUserKyc().subscribe(response => {
			if (response) {
				this.kycApproved = true;
			}
		}, error => {
			console.log("Server Error", error);
		})
	}


	fetchProjectWallet(symbol) {
		this.loaderService.show();
		this.acceleratorService.fetchProjectWallet({ startUp: symbol }).subscribe(response => {
			this.loaderService.hide();
			this.projectWalletDetails = response.data;
			this.userTotalTokenCount = response?.data?.quantity
		}, error => {
			this.loaderService.hide();
			console.log('Server Error : ', error);
		});
	}


	openPurchasePopupOne(content3) {
		if (!this.walletConnected) {
			this.toastrService.info(Messages.message.WALLET_NOT_CONNECTED)
		} else {
			this.purchaseTokenAmount
			this.numberOfTockens = null;
			this.purchaseCrypoActive = false;
			this.useWalletToPay = true;
			this.calculatedAmount = 0;
			this.totalPurchaseAmount = 0;
			this.commissionAmount = 0;
			this.gatewayData = {};
			this.gateResponse = false;
			this.openTokenPurchase(content3);
		}
	}


	nextTokenPopup(content) {
		if (!this.kycApproved) {
			this.showError(this.constants.COMPLETE_KYC);
			setTimeout(() => {
				this.modalService.dismissAll();
				this.router.navigate(['/settings/kyc']);

			}, 1000);
			return;
		}

		if (!this.tokenAmount) {
			this.showError(this.constants.INPUT_BLANK);
			return;
		}

		if (this.minimumTokenPurchase) {
			if ((this.tokenAmount < this.minimumTokenPurchase)) {
				this.showError(`MInimum amount to buy is  ${this.minimumTokenPurchase} `);
				return;
			}
		} else {
			this.showError("Please enter atleast $1 ");
			return;
		}

		if (this.maximumTokenPurchase && (this.tokenAmount > this.maximumTokenPurchase)) {
			this.showError(`Maximum amount to buy is  ${this.minimumTokenPurchase} `);
			return;
		}

		if (this.walletAmount <= 0) {
			this.showError(`Not sufficient fund in wallet `);
			return;
		}

		if (this.walletAmount < this.calculatedAmount) {
			this.showError(`Balance too lo to complete purchase `);
			return;
		}
		this.openPopup(content);
	}


	handleShowInterest(content) {
		this.openPurchasePopupOne(content)
		if (this.walletConnected) {
			let token = this.projectDetails.symbol
			localStorage.setItem("interestFor", token)
			this.registerInterest(token);
		}

	}


	registerInterest(token) {
		let dataToSend = {
			symbol: token,
			amount: 0
		}
		this.sharedService.registerUserInterest(dataToSend).subscribe((res) => {
			if (res.error) {
				console.log(res?.message)
			} else {
				this.interestRegistered = true
				this.amountService.setShowInterest(true)
			}
		}, (error) => {
			console.log(error)
		})
	}


	openPopup(content) {
		this.closeAllPopup();
		this.modalRef = this.modalService.open(content, { centered: true, size: 'md', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
	}


	openWithdrawal(content) {
		this.closeAllPopup();
		this.modalRef = this.modalService.open(content, { centered: true, size: 'md', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
		if (!this.withdrawalAmount) {
			this.withdrawalAmountError = false;
		}
	}


	closeAllPopup(clear?) {
		this.modalService.dismissAll();
		if (clear) {
			localStorage.removeItem('interestFor')
		}
		this.withdrawalAmount = 0;
		this.tokenAmount = null
		this.sigText = "";
		this.previewSignature = "";
		this.signatureStyle = "class_a";
		this.selectedClass = "";
		this.purchaseComplted = false;
		this.previewSignedSignature = "";
		this.showSignature = false;
		this.showPreviewed = false;
	}


	proceedToKYC() {
		this.modalService.dismissAll();
		this.router.navigate(['/settings/kyc']);
	}


	getWalletAddress() {
		this.acceleratorService.getWalletAddress().subscribe(response => {
			this.walletAddress = response.data?.walletAddress;
		});
	}


	onUpdateWalletAddress() {
		let data = {
			'walletAddress': this.walletAddress
		}
		this.acceleratorService.updateWalletAddress(data).subscribe(response => {
			if (!response.error) {
				this.toastrService.success(response.message, this.constants.SUCCESS, {
					timeOut: 2000,
				});
			}
		}, (error) => {
			console.error(error);
			this.toastrService.error(error.error.message, this.constants.ERROR, {
				timeOut: 3000,
			});
		})
	}


	onWithdrawalSubmit() {
		this.withdrawalAmount = +this.withdrawalAmount;
		if (!this.withdrawalAmount) {
			this.withdrawalAmountError = true
			let that = this;
			setTimeout(() => {
				that.withdrawalAmountError = false;
			}, 1500);
			return
		}
		let data = {
			"walletAddress": this.walletAddress,
			"tokenSymbol": this.localSymbol,
			"requestedAmount": this.withdrawalAmount,
			"type": "withdrawal",
			"paymode": "wallet"
		}
		this.acceleratorService.createWithdrawal(data).subscribe(response => {
			if (!response.error) {
				this.toastrService.success(response.message, this.constants.SUCCESS, {
					timeOut: 2000,
				});
				this.closeAllPopup();
			}
		}, (error) => {
			console.error(error);

			this.toastrService.error(error.error.message, this.constants.ERROR, {
				timeOut: 3000,
			});
		})
	}


	getCommissionAmount() {
		let data = {
			tokenSymbol: this.projectDetails?.symbol,
			tokenAmount: this.purchaseTokenAmount.value || 0
		}
		this.acceleratorService.getCommissionAmount(data).subscribe(response => {
			if (response.error) {
				console.log('Error', response.error);

			} else {
				console.log('Success', response);
				this.commissionAmount = response?.data || 0;
				if (this.useCommissionWallet) {
					if (this.purchaseTokenAmount.value) {
						this.totalPurchaseAmount = (Number(this.purchaseTokenAmount.value) - Number(this.commissionAmount));
					}
				}
				else {
					this.totalPurchaseAmount = this.purchaseTokenAmount.value;
				}
			}
		}, (error) => {
			console.log('Error', error);
		});
	}


	buyPackage(docuSignLocation = null) {
		if (this.purchaseTokensForm.invalid) {
			this.validator.markControlsTouched(this.purchaseTokensForm)
			return;
		}
		if (this.purchaseTokenAmount.value < Number(this.minimumTokenPurchase) || this.purchaseTokenAmount.value > Number(this.maximumTokenPurchase)) {
			return;
		}
		console.log('_+_+_+_+_+_+_+_+_+', this.walletAmount)

		if (this.walletAmount < this.totalPurchaseAmount) {
			this.toastrService.error(this.constants.BALANCE_TOO_LOW);
			return;
		}
		if (this.checkIfUserAmountExceed(this.calculatedAmount)) {
			let dataToSend: any = {
				token: 'USD',
				quantity: this.numberOfTockens,
				paymode: "wallet",
				startupId: this.projectDetails._id,
				roundId: this.openStartUpObj._id,
				hideUserInfo: this.hideUserInfo,
				useCommissionWallet: this.useCommissionWallet,
				tokenSymbol: this.projectDetails.symbol,
				tokenAmount: this.purchaseTokenAmount.value
			};
			if (docuSignLocation) {
				dataToSend.docuSign = docuSignLocation
			}
			console.log(dataToSend);
			if (this.walletAmount < this.calculatedAmount) {
				this.toastrService.error(this.constants.NOT_SUFFICIENT_FUND, this.constants.ERROR, {
					timeOut: 3000,
				});
				return;
			}
			this.loaderService.show();
			this.acceleratorService.createTransaction(dataToSend).subscribe(
				(response) => {
					if (response.error) {
						this.loaderService.hide();
						this.showError(response.message);
					} else {
						this.purchaseComplted = true
						this.loaderService.hide();
						this.toastrService.success(this.constants.SUCCESSFULLY_PURCHASED, this.constants.SUCCESS, {
							timeOut: 3000,
						});
						this.gateResponse = true;
						this.gatewayData = response.data;
						this.amountService.handlefetchWalletAmount(true)
						if (dataToSend.paymode == this.constants.WALLET) {
							this.showSuccess(this.constants.UPDATE_WALLET);
							this.amountService.setWalletAmount('Y');
							this.projectWalletDetails = parseFloat(this.projectWalletDetails) + parseFloat(this.numberOfTockens);
						}
						this.closePurchasePopUp();
					}
					this.fetchTokenTransaction();
					this.fetchProjects(this.projectDetails._id);
					this.fetchProjectDescription(this.projectDetails?._id);
					if (this.walletConnected) {
						this.fetchProjectWallet(this.projectDetails.symbol);
					}
				},
				(error) => {
					console.log("qwertyuio", error.error.message);
					this.loaderService.hide();
					console.error(error);
					this.toastrService.error(error.error.message, this.constants.ERROR, {
						timeOut: 3000,
					});
				}
			);
		}
	}


	checkIfUserAmountExceed(amount) {
		if (parseInt(amount) + (parseInt(this.userTotalTokenCount) * this.openStartUpObj?.sellingAmount.$numberDecimal) > this.openStartUpObj?.maxUserLimit) {
			let message = this.constants.PURCHASE_LIMIT_EXCEED;
			let limitLeft = this.openStartUpObj?.maxUserLimit - (parseInt(this.userTotalTokenCount) * this.openStartUpObj?.sellingAmount.$numberDecimal);
			if (limitLeft > 0) {
				message = `Purchase limit left : $${limitLeft}`;
			}
			this.toastrService.info(message);
			return;
		}
		else return true
	}


	showError(message) {
		this.succesMessage = "";
		this.errorMessage = message;
		let that = this;
		setTimeout(function () {
			that.errorMessage = ""
		}, 6000)
	}


	showSuccess(message) {
		this.succesMessage = message;
		this.errorMessage = "";
		let that = this;
		setTimeout(function () {
			that.succesMessage = ""
		}, 6000)
	}


	closePopupPayment(type) {
		let message = "";
		if (type == 1) {
			message = this.constants.SUCCESSFUL_PAYMENT;
			this.showSuccess(message);
		} else if (type == 2) {
			message = this.constants.INVOICE_VALID_FOR_1HOUR;
			this.showSuccess(message);
		} else {
			message = this.constants.INVOICE_CANCELLED_AUTOMATICALLY;
			this.showError(message);
		}
		let that = this;
		setTimeout(function () {
			that.modalService.dismissAll();
		}, 3000);
	}


	sendDataToInvoice(data) {
		let userData = JSON.stringify(data);
		this.router.navigate(['/wallet/invoice'], { queryParams: { startup: userData } });
	}


	openCreatedInvoice(content, transaction) {
		this.createdInvoiceData = transaction.gatewaydata;
		this.openPopup(content);
	}


	openTokenPurchase(content3) {
		this.modalService.open(content3, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", windowClass: "token-purchase" }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}


	openInvoicePopup(content, data) {
		let amount = data?.tokenAmount?.$numberDecimal * 1 +
			data?.walletAmount?.$numberDecimal * 1 +
			data?.commissionAmount?.$numberDecimal * 1

		if (data?.commissionAmount?.$numberDecimal < amount * .15) {
			this.isDeductionLess = true
		} else {
			this.isDeductionLess = false
		}

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "lg", windowClass: "invoice-popup" }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
		this.selectedTransaction = data
	}


	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}


	onSubmit(comments, numberOfToken) {
		if (comments == '' || numberOfToken == '') {
			this.requestMoreTokensError = true;
			let that = this;
			setTimeout(() => {
				that.requestMoreTokensError = false;
			}, 3000);
			return;
		}
		let userData = JSON.parse(localStorage.getItem('_u'));
		let data = {
			tokenSymbol: this.projectDetails?.symbol,
			tokenRequired: numberOfToken,
			roundName: this.openStartUpObj?.name,
			tokenPrice: this.openStartUpObj?.sellingAmount.$numberDecimal,
			message: comments,
			id: userData._id,
			startUpId: this.projectDetails?._id
		}

		this.loaderService.show();
		this.acceleratorService.requestForMoreToken(data).subscribe(response => {
			this.loaderService.hide();
			if (response.error) {
				console.log('Error');
			} else {
				this.modalService.dismissAll();
				this.toastrService.success(this.constants.REQUEST_SUBMITTED_SUCCESSFULLY, this.constants.SUCCESS, {
					timeOut: 3000,
				});
			}
		}, error => {
			this.loaderService.hide();
			this.toastrService.error(error.error.message, this.constants.SERVER_ERROR, {
				timeOut: 3000,
			});
			console.log('Server Error : ', error);
		});
	}


	// <!--*****************************************DOCUSIGN**************************************************-->

	openSamplePopUp(content) {
		this.modalService.open(content, { size: 'lg', centered: true })
	}


	docuSign(content) {
		this.modalService.open(content, { centered: true, size: 'md' })
	}


	resetSignature() {
		this.showSignature = false;
		this.previewSignature = "";
	}


	generateDesigns() {
		if (!this.sigText) {
			this.showPreviewed = false
		}
		console.log("-098765432", this.sigText)
		this.previewSignature = this.sigText.replace(/ /g, '');
		this.previewSignedSignature = this.previewSignature
	}


	geneRateSignature() {
		this.resetSignature();
		this.previewSignature = this.sigText.replace(/ /g, '');
		this.showSignature = true;
		this.showPreviewed = false;
	}


	changeFont(value, selectedStyle) {
		console.log("Slected style : ", selectedStyle);
		this.showSignature = false;
		this.previewSignedSignature = this.previewSignature;
		this.showPreviewed = value
		console.log("009912344", value);
		this.selectedClass = selectedStyle;
	}


	onChangehideUserInfo() {
		this.hideUserInfo = !this.hideUserInfo;
	}


	onSubmitDocuSign() {
		let index = this.availableStyles.findIndex(el => el == this.signatureStyle) + 1;
		let data = {
			tokenName: this.projectDetails?.symbol,
			fontOption: index,
			signature: this.previewSignature,
			purchaseAmount: this.calculatedAmount,
			price: this.openStartUpObj?.sellingAmount.$numberDecimal,
			count: this.tokenCount
		}
		this.loaderService.show();
		this.acceleratorService.onAddDocusign(data).subscribe(response => {
			this.loaderService.hide();
			if (response.error) {
				console.log('Error', response.error);
				this.toastrService.clear();
				this.toastrService.error(this.constants.SOME_ERROR_OCCURED || this.constants.SERVER_ERROR, this.constants.ERROR, {
					timeOut: 3000,
				});
			} else {
				this.buyPackage(response.data.location);
			}
		}, (error) => {
			this.loaderService.hide();
			this.toastrService.clear();
			this.toastrService.error(error?.error?.message || this.constants.SERVER_ERROR, this.constants.ERROR, {
				timeOut: 3000,
			});
		});
	}


	callAddFundPopUp() {
		this.closeAllPopup()
		this.amountService.handleshowAddMoney(true)
	}


	updateAmount($event) {
		let userInputTokenAmount = $event.target.value
		let count = Number(userInputTokenAmount) / this.openStartUpObj?.sellingAmount.$numberDecimal
		if (Number.isInteger(count)) {
			this.tokenCount = count
		} else {
			this.tokenCount = count.toFixed(8)
		}
		this.calculatedAmount = parseFloat(userInputTokenAmount)
	}


	callEnableWallet(content) {
		this.amountService.handleEnableWallet(true);
		let token = this.projectDetails.symbol
		localStorage.setItem("interestFor", token)
		this.registerInterest(token);

	}


	checkInputValue($event) {
		if (!(($event.keyCode > 95 && $event.keyCode < 106) ||
			($event.keyCode > 47 && $event.keyCode < 58) ||
			$event.keyCode == 8 || $event.keyCode == 190)) {
			return false;
		}
	}

	// <!--*****************************************DOCUSIGN**************************************************-->

	goToRefer() {
		this.router.navigate(['refer']);
	}


	cancelPurchase(transaction) {
		let data = {
			purchaseId: transaction._id
		}
		var r = confirm('Are you sure');
		if (r == true) {
			this.loaderService.show();
			this.acceleratorService.withdrawStartupPurchase(data).subscribe(response => {
				this.loaderService.hide();
				if (response.error) {
					console.log('Error', response.error);
					this.toastrService.clear();
					this.toastrService.error(this.constants.SOME_ERROR_OCCURED || this.constants.SERVER_ERROR, this.constants.ERROR, {
						timeOut: 3000,
					});
				} else {
					this.fetchTokenTransaction();
				}
			}, (error) => {
				this.loaderService.hide();
				this.toastrService.clear();
				this.toastrService.error(error?.error?.message || this.constants.SERVER_ERROR, this.constants.ERROR, {
					timeOut: 3000,
				});
			});
		}
	}
	
	fetchProjectDescription(id){
		let dataToSend = {
			id: id
		}
		this.loaderService.show();
		this.acceleratorService.fetchStartupDescription(dataToSend).subscribe((res) =>{
			this.loaderService.hide();
			if(res?.data){
				this.projectDescription = res?.data
			}
			
		}, (error)=>{
			this.loaderService.hide();
			console.log(error);
		})
		
	}

}