import { AfterViewInit, Component, DoCheck, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/config/message';
import { AppInterceptorService, CommonApiService, LoaderService } from 'src/app/shared/services';
import { AmountService } from 'src/app/shared/services/amount.service';
import { WalletService } from '../../wallet/services/wallet.service';
import { SettingService } from '../service/service.service';
declare var snsWebSdk: any;
declare var $: any;

@Component({
	selector: 'app-kyc',
	templateUrl: './kyc.component.html',
	styleUrls: ['./kyc.component.css'],
	providers: [NgbPaginationConfig]
})
export class KycComponent implements OnInit {
	isDuplicate:boolean=false;
	emailVerified:boolean=false;
	/****Variable****/
	user = null;
	kycRejectedReason = null;
	paramId: any
	kycStatus: any;
	kycVerificationLink: any;
	kycLinkId: any;
	kycVerificationDetails: any;
	kycReferenceId: any;
	facekiKycStatus: any;
	facekiVerificationStatus: any = false;
	public safeURL: SafeResourceUrl;
	/****Boolean****/
	walletConnected = true;
	proceedForKYC = false
	
	/****Constants****/
	constants = Messages.CONST_MSG

	/** Element Ref */
	@ViewChild("kycVerifyModal", { static: true }) kycVerifyModal: ElementRef;
	@ViewChild('myiframe', {static:false}) iframe: ElementRef;
	currentUrl: any;
	
	constructor(
		private toastrService: ToastrService,
		public service: SettingService,
		public router: Router,
		private loaderService: LoaderService,
		private modalService: NgbModal,
		public sharedService: CommonApiService,
		private route: ActivatedRoute,
		private titleService: Title,
		private amountService: AmountService,
		public walletService: WalletService,
		private interceptService: AppInterceptorService,
		protected sanitizer: DomSanitizer
	) { }

	ngOnInit(): void {
		console.log(this,"hiiiii")
		this.loaderService.hide()
		this.getWalletAmount();
		this.amountService.getWalletConnection().subscribe((res) => {
			this.walletConnected = res
		})
		this.titleService.setTitle("TDX Launchpad | KYC");
		this.user = this.sharedService.getCurrentUser();
		this.emailVerified = this.user?.emailVerified
		this.route.params.subscribe((param) => {
			if (param?.id) {
				this.paramId = param.id
			} else {
				this.paramId = null
			}
		})
		this.getUserDetails();
		this.getFacekiKycDetails();

		// $(document).ready(function() {
		// 	console.log("document ready function calling");
		// 	$('#filecontainer').load(function() {
		// 		console.log("iframe loading");
		// 	  alert($(this).get(0).contentWindow.location.href);
		// 	}); 
		// });
		
		// var page = document.getElementById("filecontainer");

		// page.addEventListener("load", this.displayMessage)

		// const iframe2 = document.getElementById('filecontainer') as HTMLIFrameElement;

		// iframe2.onload = () => {
		// 	console.log("iframe 2",iframe2);
		// // Access and interact with the iframe content or components here
		// };
		// var urlCheckInterval = setInterval(this.checkForUrlChange, 10000); // Check every 1 second (adjust as needed)

		// $('#filecontainer')?.load(function(){

		// 	var iframe = $('#filecontainer')?.contents();
		// 	console.log("iframe contents",iframe);
		// 	// iframe.find("#choose_pics").click(function(){
		// 	// 	   alert("test");
		// 	// });
		// });
	}

	/**
	 * @description: used to get user details
	 */
	getUserDetails() {
		if (this.user.KYCRequested) {
			this.proceedForKYC = true
			this.getFacekiKycDetails();
			// this.getKycDetails();
		}
	}

	/**
	 * @description: used to get SMSB Token
	 */
	async getSMSBToken() {
		try {
			this.loaderService.show();
			let token = await this.getNewAccessToken();
			this.launchWebSdk(token, (this.sharedService.getCurrentUser as any)?.email);
			this.loaderService.hide();
		} catch (error) {
			console.log(error);

		}
	}
	/**
   * @param accessToken - access token that you generated on the backend in Step 2
   * @param applicantEmail - applicant email (not required)
   * @param applicantPhone - applicant phone, if available (not required)
   * @param customI18nMessages - customized locale messages for current session (not required)
   */
	launchWebSdk(accessToken, applicantEmail = null, applicantPhone = null, customI18nMessages = null,) {
		let snsWebSdkInstance = snsWebSdk.init(
			accessToken,
			() => this.getNewAccessToken()
		)
			.withConf({
				lang: 'en',
				email: applicantEmail,
				phone: applicantPhone,
				i18n: customI18nMessages,
				uiConf: {
					customCss: "https://url.com/styles.css"
				},
			})
			.withOptions({ addViewportTag: false, adaptIframeHeight: true })

			.on('idCheck.stepCompleted', (payload) => {
				console.log('stepCompleted', payload)
			})
			.on('idCheck.onError', (error) => {
				console.log('onError', error)
			})
			.build();

		snsWebSdkInstance.launch('#sumsub-websdk-container')
	}

	/**
	 * @description: used to get new access token
	 * @returns access token
	 */
	getNewAccessToken() {
		return new Promise(async (resolve, reject) => {
			this.service.getSMSBToken({}).subscribe((res) => {
				if (res && res.data && res.data.key)
					resolve(atob(res.data.key))
			}, (error) => {
				reject(error)
				console.log(error);
			})
		});
	}

	/**
	 * @description: used to get kyc details
	 */
	getKycDetails() {
		this.loaderService.show()
		this.service.getKycDetails().subscribe(response => {
			this.loaderService.hide()
			if (response.error) {
				console.log('Error');
			} else {
				console.log('_+_+_+_+_+_==>', response);
				if (response && response.data) {
					let data = response.data;
					if (data?.KYCDetails) {
						this.kycRejectedReason = data?.KYCDetails?.reviewResult?.moderationComment
					}
					if (this.paramId && data?.KYCStatus == this.constants.APPROVED) {
						this.kycStatus = "APPROVED"
						this.goToLaunchpad()
					} else {

						this.kycStatus = data.KYCStatus
						if (data?.KYCDetails && data?.KYCDetails?.reviewResult && (data?.KYCDetails?.reviewResult?.reviewAnswer && data?.KYCDetails?.reviewResult?.reviewAnswer == this.constants.RED) && (data?.KYCDetails?.reviewResult?.reviewRejectType && data?.KYCDetails?.reviewResult?.reviewRejectType == this.constants.RETRY)) {
							this.kycStatus = "PENDING"
						}
						// this.getSMSBToken();
					}
				}
			}
		}, (error) => {
			this.loaderService.hide()
			this.toastrService.clear();
			this.toastrService.error(this.constants.SOMETHING_WENT_WRONG, this.constants.ERROR, {
				timeOut: 3000,
			});
		})
	}

	getFacekiKycDetails() {
		this.loaderService.show()
		this.service.getFacekiKycDetails().subscribe(response => {
			this.loaderService.hide()
			if (response.error) {
				console.log('Error');
			} else {
				console.log('_+_+_+_+_+_==>kyc ', response);
				let data = response?.data;
				this.kycStatus = data?.KYCStatus
				this.kycRejectedReason = data?.KYCDetails?.KYCRejectReason[0];
				if(data?.KYCDetails?.duplicate){
					this.isDuplicate=true;
				}else{
					this.isDuplicate=false;

				}
			}
		}, (error) => {
			this.loaderService.hide()
			this.toastrService.clear();
		})
	}



	/**
	 * @description: used to create user wallet
	 */
	creatUserWallet() {
		this.amountService.handleEnableWallet(true)
	}

	/**
	 * @description: user to get wallet amount
	 */
	getWalletAmount() {
		this.walletService.getWallet().subscribe(response => {
			if (response.error) {
				console.log('Error');
			} else {
				this.walletConnected = response.data?.walletExist
				if (response.data.balance) {
					let amount: any = (response.data.balance.$numberDecimal || response.data.balance);
					if (!Number.isInteger(Number(amount))) {
						this.amountService.setMessage(Number(amount).toFixed(4));
					} else {
						this.amountService.setMessage(amount);
					}
				}
			}
		}, error => {
			console.log('Server Error : ', error);
		});
	}


	onSubmit() {
		console.log("kyc requiest")
	}

	/**
	 * @description: used to convert base 64 to blob
	 * @param dataurl 
	 * @param filename 
	 * @returns 
	 */
	base64ToBlob(dataurl, filename) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}

	/**
	 * @description: used to close modal
	 */
	closeModal() {
		this.modalService.dismissAll()
	}

	/**
	 * @description: used to navigate to launchpad
	 */
	goToLaunchpad() {
		this.router.navigate(['/launchpad'])
	}
	
	/**
	 * @description: used to get SMSB token
	 */
	// handleKYC() {
	// 	if (!this.walletConnected) {
	// 		this.toastrService.info(this.constants.PLAESE_ENABLE_YOUR_WALLET);
	// 		return;
	// 	}
	// 	this.proceedForKYC = true
	// 	this.getSMSBToken()
	// }

	onStartKyc(){
		if (!this.walletConnected) {
			this.toastrService.info(this.constants.PLAESE_ENABLE_YOUR_WALLET);
			return;
		}
		console.log(this.emailVerified)
		if(!this.emailVerified){

			this.toastrService.info('Please verify your email, to proceed with kyc verification.')
			this.router.navigate(['/settings/profile']);
			return;
		}

		this.proceedForKYC = true
		// let id = localStorage.getItem('kycReferenceId');
		// if(id){
		// 	this.amountService.setApiRequestUrlIntercept(true);
		// 	this.getKycVerificationDetailsByReferenceId();
		// }
		// this.amountService.setApiRequestUrlIntercept(true);
		// this.getKycAuthorizationToken();
		this.getKycVerificationLink();
	}

	// getKycAuthorizationToken() {
	// 	let dataToSend = {
	// 		clientId: '4hauttsghds9o0ikqqd7unpa8e',
	// 		clientSecret: '1r54j73djnr8673c7u93mtj64j3m24n3oo5t5av57bh9th8b3qc7'
	// 	}
	// 	this.loaderService.show()
	// 	this.service.getFacekiAuthorizationToken(dataToSend).subscribe(response => {
	// 		this.loaderService.hide()
	// 		console.log("token response",response);
	// 		if (response.error) {
	// 			console.log('Error');
	// 		} else {
	// 			console.log('_+_+_+_+_+_==> access token', response?.data?.access_token);
	// 			localStorage.setItem('kyc-token',response?.data?.access_token);
	// 			this.getKycVerificationLink();
	// 		}
	// 	}, (error) => {
	// 		console.log("token error",error);
	// 		this.loaderService.hide()
	// 	})
	// }

	getKycVerificationLink() {
		this.loaderService.show()
		this.service.getKycVerifyLink().subscribe(response => {
			this.loaderService.hide()
			console.log("verification link response",response);
			if (response?.error) {
				this.toastrService.error(response?.error?.message);
				console.log('Error');
			} else {
				this.kycVerificationLink = response?.data?.KYCLink;
				// this.kycVerificationLink = 'http://localhost:4200/kyc-verification';

				this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.kycVerificationLink);
				// this.modalService.open(this.kycVerifyModal, { centered: true ,backdrop: 'static', size:"lg", windowClass: 'kyc-popup'});
				console.log(this.iframe, "iframe")
			}
		}, (error) => {
			console.log("verification link error",error);
			this.loaderService.hide()
			this.toastrService.error(error?.error?.message);
		})
	}

	// getKycVerificationLink() {
	// 	let dataToSend = {
	// 		"expiryTime": 0,
	// 		"applicationId": "4hauttsghds9o0ikqqd7unpa8e"
	// 	}
	// 	this.loaderService.show()
	// 	this.service.getKycVerifyLinkByToken(dataToSend).subscribe(response => {
	// 		this.loaderService.hide()
	// 		console.log("verification link response",response);
	// 		if (response?.error) {
	// 			this.toastrService.error(response?.error?.message);
	// 			console.log('Error');
	// 		} else {
	// 			this.kycVerificationLink = response?.url;
	// 			// this.kycVerificationLink = this.sanitizer.bypassSecurityTrustUrl(response?.url)
	// 			console.log("kyc verification link",this.kycVerificationLink);
	// 			this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.kycVerificationLink);

	// 			// const segments = this.kycVerificationLink.split('/');
	// 			// const lastSegment = segments[segments.length - 1];
	// 			this.kycLinkId = response?.data;
	// 			console.log("kyc link id",this.kycLinkId);
	// 			this.modalService.open(this.kycVerifyModal, { centered: true ,backdrop: 'static', size:"lg"});
	// 			this.amountService.setApiRequestUrlIntercept(false);
	// 			const iframe = document.getElementById('filecontainer') as HTMLIFrameElement;
	// 			iframe.contentWindow.postMessage({ type: 'custom-event', data: 'your-data' }, this.kycVerificationLink);
	// 			console.log("-------------->>>>>>>>>>>>>",iframe);
	// 		}
	// 	}, (error) => {
	// 		console.log("verification link error",error);
	// 		this.loaderService.hide()
	// 		this.toastrService.error(error?.error?.message);
	// 	})
	// }

	onCloseKycPopup(){
		// this.amountService.setApiRequestUrlIntercept(true);
		this.modalService.dismissAll();
		this.saveKycDetails();
		// this.getKycVerificationDetailsByLinkId();
	}

	// getKycVerificationDetailsByLinkId() {
	// 	let dataToSend = {
	// 		linkId: this.kycLinkId,
	// 	}
	// 	this.loaderService.show()
	// 	this.service.getFacekiKycDetailsByLink(dataToSend).subscribe(response => {
	// 		this.loaderService.hide()
	// 		console.log("verification details response",response);
	// 		if (response.error) {
	// 			console.log('Error');
	// 		} else {
	// 			this.kycVerificationDetails = response?.data
	// 			console.log("kyc verification details",this.kycVerificationDetails);
	// 			this.kycReferenceId = response?.data[0]?.referenceId
	// 			localStorage.setItem('kycReferenceId',response?.data[0]?.referenceId)
	// 			this.facekiKycStatus = response?.data[0]?.status
	// 			console.log("faceki kyc status",this.facekiKycStatus)
	// 			this.facekiVerificationStatus = response?.data[0]?.kycResponse?.verification?.passed
	// 			console.log("faceki verification status",this.facekiVerificationStatus);
	// 			this.amountService.setApiRequestUrlIntercept(false);
	// 			this.saveKycDetails();
	// 			// this.getKycVerificationDetailsByReferenceId();
	// 		}
	// 	}, (error) => {
	// 		console.log("verification details error",error);
	// 		this.loaderService.hide()
	// 	})
	// }

	// getKycVerificationDetailsByReferenceId() {
	// 	this.amountService.setApiRequestUrlIntercept(true);
	// 	let id = localStorage.getItem('kycReferenceId');
	// 	let dataToSend = {
	// 		referenceId: this.kycReferenceId || id,
	// 	}
	// 	this.loaderService.show()
	// 	this.service.getFacekiKycDetailsByReferenceId(dataToSend).subscribe(response => {
	// 		this.loaderService.hide()
	// 		console.log("reference id response",response);
	// 		if (response.error) {
	// 			console.log('Error');
	// 		} else {
	// 			this.amountService.setApiRequestUrlIntercept(false);
	// 		}
	// 	}, (error) => {
	// 		console.log("reference id error",error);
	// 		this.loaderService.hide()
	// 	})
	// }

	saveKycDetails() {
		let dataToSend = {
			KYCLink: this.kycVerificationLink
		}
		this.loaderService.show()
		this.service.saveFacekiKycDetails(dataToSend).subscribe(response => {
			this.loaderService.hide()
			if (response?.error) {
				console.log('Error');
				// this.toastrService.error(response?.message);
				this.getFacekiKycDetails();
			} else {
				this.getFacekiKycDetails();
				// this.getKycDetails();
			}
		}, (error) => {
			this.loaderService.hide()
			// this.toastrService.error(error?.error?.message);
			this.getFacekiKycDetails();
		})
	}

	// Function to check for URL changes
	checkForUrlChange() {
		console.log("calling url change check");
		// var iframe = document.getElementById("filecontainer");
		// this.currentUrl = iframe?.src;
		var iframe = $('#filecontainer')?.contents();
		console.log("iframe contents",iframe);
		var currentUrl = iframe.src;
		if (iframe.src !== currentUrl) {
			// The iframe's URL has changed
			var newUrl = iframe.src;
			console.log("New URL: " + newUrl);

			// You can add your custom logic here to handle the URL change
			// For example, you might want to parse the URL and take action based on its parameters.
			
			// Update the current URL for the next check
			currentUrl = newUrl;
		}
	}
	

	// ngAfterViewInit() {
	// 	// Access the native iframe element
	// 	const iframeElement: HTMLIFrameElement = this.iframe?.nativeElement;

	// 	console.log("ng after view initi",iframeElement);
	
	// 	// Initialize the current URL
	// 	let currentUrl = iframeElement?.src;
	
	// 	// Add an event listener to capture URL changes
	// 	iframeElement?.addEventListener('load', () => {
	// 		console.log("iframe url changes======",iframeElement?.src);
	// 	  if (iframeElement?.src !== currentUrl) {
	// 		// The iframe's URL has changed
	// 		const newUrl = iframeElement?.src;
	// 		console.log('New URL:', newUrl);
	
	// 		// Add your custom logic here to handle the URL change
	
	// 		// Update the current URL for the next check
	// 		currentUrl = newUrl;
	// 	  }
	// 	});

	// 	// $('#filecontainer')?.load(function(){
	// 	// 	var iframe = $('#filecontainer')?.contents();
	// 	// 	console.log("iframe contents",iframe);
	// 	// 	// iframe.find("#choose_pics").click(function(){
	// 	// 	// 	   alert("test");
	// 	// 	// });
	// 	// });
	// }



	// ngDoCheck() {
	// 	// console.log('calling ng do check changes+++++++++++');
	// 	var page = document.getElementById("filecontainer");

	// 	// page?.addEventListener("load", this.displayMessage)


	// 		var iframe = $('#filecontainer')?.contents();
	// 		// console.log("iframe contents",iframe);
	// 			// Access the native iframe element
	// 			const iframeElement: HTMLIFrameElement = this.iframe?.nativeElement;			
	// 			// Initialize the current URL
	// 			let currentUrl = iframeElement?.src;
	// 			// console.log("iframe element-------",iframeElement);
	// 			// Add an event listener to capture URL changes
	// 			iframeElement?.addEventListener('load', () => {
	// 				console.log("add event listener element ref===========")
	// 				// console.log("iframe url changes======",iframeElement?.src);
	// 			  if (iframeElement?.src !== currentUrl) {
	// 				// The iframe's URL has changed
	// 				const newUrl = iframeElement?.src;
	// 				console.log('New URL:', newUrl);
			
	// 				// Add your custom logic here to handle the URL change
			
	// 				// Update the current URL for the next check
	// 				currentUrl = newUrl;
	// 			  }
	// 			});
	// }
	goBack(){
		this.getFacekiKycDetails();
		this.safeURL = null;
	}

	ngOnDestroy() {
		localStorage.removeItem('kycReferenceId');
	}
}
