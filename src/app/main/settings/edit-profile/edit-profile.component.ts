import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SettingService } from '../service/service.service';
import { CommonApiService, LoaderService, FormValidatorService } from 'src/app/shared/services';
import { AmountService } from 'src/app/shared/services/amount.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/config/constant';
import { Messages } from 'src/app/config/message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import noWhitespaceValidator from 'src/app/shared/services/no-white-space-validator.service';
import { ShoutOutService } from '../../shout-out/service/shout-out.service';
import { environment } from 'src/environments/environment';
import { CookiesService } from 'src/app/shared/services/cookies.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
	selector: "app-edit-profile",
	templateUrl: "./edit-profile.component.html",
	styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
	/*****Form****/
	formData: FormGroup;
	updateProfileForm: FormGroup;
	changePasswordForm: FormGroup;
	public otpForm: FormGroup;

	/*****Object****/
	dataToConnectSocial: {};

	/******Array*****/
	socialArray = [];
	activeSocialConnection = []
	countriesList = [];
	/*********Variable*********/
	localImage = null;
	userObj = null;
	email = null;
	username = null;
	errorUpload = null;
	countryCode = null;
	previousFile = null;
	profilePictureSrc: any;
	userData: any;
	userRating: any;
	userInvestorPoints: any;
	selectedImage: any;
	investorGraphNeedleValue: any = 10;
	public canvasWidth = 250
	public centralLabel = ''
	public chartName = 'Gauge chart'
	public options = {
		hasNeedle: true,
		needleColor: 'gray',
		needleUpdateSpeed: 1000,
		arcColors: ['#FFAD2F','lightgray'],
		arcDelimiters: [10],
		needleStartValue: 50,
	}
	taskErrorMessage = '';
	selectedModalType = '';

	/*********Constants*********/
	max_size = Constants.IMAGE_SIZE;
	constants = Messages.CONST_MSG;
	SOCIAL_CONNECTIONS = Constants.SOCIAL_CONNECTIONS;
	modalType = Constants.MODAL_TYPE;
	otpSettings = {
		allowNumbersOnly: true,
		length: 6,
		inputStyles: {
			'margin-left': '10px',
			'margin-bottom': '20px'
		}
	}

	/** Element Ref */
	@ViewChild("infoModal", { static: true }) infoModal: ElementRef;
	
	/** Boolean */
	public showPassword = false;
	public showConPassword = false;
	isTelegramLinked = false;
	isYoutubeLinked = false;
	istwitterLinked = false;
	isDiscordLinked = false;
	showChangePassword = false;
	showOtpSuccess = false;
	walletAddress:any;

	constructor(
		private toastrService: ToastrService,
		private modalService: NgbModal,
		public router: Router,
		private loderService: LoaderService,
		private fb: FormBuilder,
		private service: SettingService,
		private validator: FormValidatorService,
		private commonApi: CommonApiService,
		private obsService: AmountService,
		private shoutOutService: ShoutOutService,
		private cookieService: CookiesService,
		public authService: AuthService,
	) { }

	ngOnInit(): void {
		this.getWalletAddress()
		this.createUserProfileForm();
		this.getProfileDetails();
		this.getUserRating();
		this.getUserInvestorScore();
		this.createChangePasswordForm();
		this.getActiveSocialConnection();
		this.createOtpForm();
		$(document).on("change", ".uploadProfileInput", function () {
			var triggerInput = this;
			var holder = $(this).closest(".pic-holder");
			var wrapper = $(this).closest(".profile-pic-wrapper");
			$(wrapper).find('[role="alert"]').remove();
			triggerInput.blur();
			var files = !!this.files ? this.files : [];
			if (!files.length || !window.FileReader) {
			  return;
			}
			if (/^image/.test(files[0].type)) {
			  // only image file
			  var reader = new FileReader(); // instance of the FileReader
			  reader.readAsDataURL(files[0]); // read the local file
		  
			  reader.onloadend = function () {
				$(holder).find(".pic").attr("src", this.result);
			  };
			}
		  });

		let that = this;
		this.userObj = this.commonApi.getCurrentUser();
		console.log("current user login",this.userObj);
		this.email = this.userObj.email;
		this.username = this.userObj.name;
	}

	/**
	 * @description: used to create change password form
	 */
	createChangePasswordForm(){
		this.changePasswordForm = this.fb.group({
			password: new FormControl('', [Validators.required,noWhitespaceValidator, Validators.minLength(8), Validators.maxLength(40)]),
			confirmPass: new FormControl('', [Validators.required, noWhitespaceValidator]),
		})
	}
	get password(): any { return this.changePasswordForm.get('password'); }
	get confirmPass(): any { return this.changePasswordForm.get('confirmPass'); }

	/**
	 * @description: used to create profile form
	 */
	createUserProfileForm(){
		this.updateProfileForm = this.fb.group({
			profilePicture: ['']
		})
	}
	get profilePicture(): any { return this.updateProfileForm.get('profilePicture'); }

	createOtpForm() {
		this.otpForm = this.fb.group({
			otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
		})
	  }
	
	get otp() { return this.otpForm.get('otp'); }

	/**
	 * @description: used to get profile and patch country name
	 */
	getCountry() {
		this.loderService.show();
		this.service.getProfile().subscribe(response => {
			this.loderService.hide();
			if (response.error) {
				console.log('Error : ', response.error);
			} else {
				this.formData.patchValue({
					'countryName': response.data.countryName
				})
			}
		}, (error) => {
			this.toastrService.clear();
			this.toastrService.error(this.constants.SOMETHING_WENT_WRONG, this.constants.ERROR, {
				timeOut: 3000,
			});
			console.log("Server Error : ", error);
		});
	}

	getWalletAddress(){
		this.loderService.show();
		this.service.getWalletAddress().subscribe(response => {
			this.loderService.hide();
			if (response.error) {
				console.log('Error : ', response.error);
			} else {
				this.walletAddress=response?.data[0]?.walletAddress||[	]
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
	 * @description: used to get country list
	 */
	getCountriesList() {
		this.loderService.show();
		this.service.getCountriesList().subscribe(response => {
			this.loderService.hide();
			if (response.error) {
			} else {
				this.countriesList = response.data;
			}
		}, (error) => {
			this.toastrService.clear();
			this.toastrService.error(this.constants.SOMETHING_WENT_WRONG, this.constants.ERROR, {
				timeOut: 3000,
			});
		});
	}

	/**
	 * @description: used to create form
	 */
	createForm() {
		this.formData = this.fb.group({
			name: new FormControl(null, [
				Validators.required
			]),
			countryName: new FormControl(null, [Validators.required])
		});
	}

	get name() {
		return this.formData.get("name");
	}

	/**
	 * @description: used to get profile picture details
	 */
	getProfileDetails() {
		this.loderService.show();
		this.service.getProfile().subscribe(
			(response) => {
				this.loderService.hide();
				if (response?.error) {
					console.log("Error");
				} else {
					$(".profile-pic").attr("src", response?.data?.profilePicture);
					this.profilePictureSrc = response?.data?.imagePreview
					this.userData = response?.data
					
				}
			},
			(error) => {
				console.log("Server Error: ", error);
			}
		);
	}

	/**
	 * @description: used to get user rating
	 */
	getUserRating() {
		this.loderService.show();
		this.service.getUserRating().subscribe(
			(response) => {
				this.loderService.hide();
				if (response?.data) {
					this.userRating = response?.data?.investorRating;
				
				} 
			},
			(error) => {
				console.log("Server Error: ", error);
			}
		);
	}

	/**
	 * @description: used to get user investor score
	 */
	getUserInvestorScore() {
		this.loderService.show();
		this.service.getUserInvestorScore().subscribe(
			(response) => {
				this.loderService.hide();
				if(response?.data){
					if(response?.data?.tokenPoints?.$numberDecimal < 0){
						this.userInvestorPoints = 0;
					}
					else{
						this.userInvestorPoints = response?.data?.tokenPoints?.$numberDecimal || 0;
						this.userInvestorPoints= this.userInvestorPoints % 2 >= 0.5 ? Math?.ceil(this.userInvestorPoints) : Math?.floor(this.userInvestorPoints)
						console.log("user investor points",this.userInvestorPoints);
						let investorScorePer = (this.userInvestorPoints / 4000)  * 100
						if(investorScorePer >= 100){
							investorScorePer = 99.99
						}
						else{
							investorScorePer = investorScorePer
						}
						this.investorGraphNeedleValue = investorScorePer;
						console.log("investor score percent",investorScorePer);
						this.changearcDelimiter(0,investorScorePer);
					}
				}
				else{
					this.userInvestorPoints = 0;
				}
			},
			(error) => {
				console.log("Server Error: ", error);
			}
		);
	}

	/**
	 * @description: used to change arc delimeter
	 * @param arcDelimiter 
	 * @param delimiterValue 
	 */
	changearcDelimiter(arcDelimiter: number, delimiterValue: number) {
		this.options.arcDelimiters[arcDelimiter] = delimiterValue;
	}

	/**
	 * @description: on change function of image
	 * @param $event 
	 * @param fileInput 
	 * @returns 
	 */
	onSelectImage($event, fileInput: any) {
		console.log("select image func",$event);
		this.profilePicture.setValidators(Validators.required);

		let file = $event.target.files[0];
		this.selectedImage = null;
		let typeArray = ["jpeg", "png", "jpg"];

		if (!typeArray.includes(file?.name?.split(".")?.pop()?.toLowerCase())) {
			this.updateProfileForm.patchValue({
				profilePicture: null,
			});
			this.selectedImage = "";
			this.toastrService.error(Messages.CONST_MSG.SELECT_PROPER_IMG_FILE);
			return;
		}

		if (file?.size > Constants.IMAGE_SIZE) {
			this.updateProfileForm.patchValue({
				profilePicture: null,
			});
			this.selectedImage = "";
			this.toastrService.error(Messages.CONST_MSG.MAX_5MB_ALLOWED);
			return;
		}

		const URL = window.URL || window.webkitURL;
		const Img = new Image();

		const filesToUpload = fileInput.target.files;
		Img.src = URL.createObjectURL(filesToUpload[0]);

		Img.onload = (e: any) => {
			this.selectedImage = file;
			this.uplaodImage();
		};
	}

	/**
	 * @description: used to upload image
	 */
	uplaodImage() {
		this.loderService.show();
		let fd = new FormData();
		fd.append("file", this.	selectedImage);
		this.service.profileImageUpload(fd).subscribe((resp) => {
				this.loderService.hide();
				if(resp){
					this.profilePictureSrc = resp?.url
					this.updateUserProfilePic(resp?.url);
					this.profilePictureSrc = resp?.imagePreview;
				}
			},
			(error) => {
				this.updateProfileForm.patchValue({
					profilePicture: null,
				});

				this.selectedImage = "";
				this.profilePictureSrc = "";
				this.profilePicture.setValidators(Validators.required);
				this.toastrService.error(
					error?.error?.message
				);
				this.loderService.hide();
			}
		);
	}

	/**
	 * @description: used to update user profile pic
	 * @param profilePic 
	 */
	updateUserProfilePic(profilePic) {
		this.loderService.show();
		let dataToSend = {
			profilePicture: profilePic
		}
		console.log("data to send update profile",dataToSend);
		this.service.updateProfilePic(dataToSend).subscribe((resp) => {
			this.loderService.hide();
			if(resp?.status == 200){
				this.toastrService.success(Messages.CONST_MSG.PROFILE_UPDATED_SUCCESSFULLY, "Success", {
					timeOut: 3000
				});
				console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
				document.getElementById('getProfileImageId')?.click();
			}

		}, (err) => {
			this.profilePictureSrc = this.userData?.imagePreview || '';
			this.profilePicture.value = null
			this.loderService.hide();
			this.toastrService.error(err?.error?.message || Messages.CONST_MSG.ERROR_IN_UPDATE_PROFILE_PIC, "error", {
				timeOut: 3000
			});
			console.log(err);
		});
	}

	/**
	 * @description: used to get active social connections
	 */
	getActiveSocialConnection() {
		this.loderService.show();
		this.shoutOutService.getSocialConnection().subscribe(
			(resp) => {
				this.loderService.hide();
				if (resp.error) {
					console.log("Error");
				} else {
					this.modalService.dismissAll();
					if (!resp.data) return;
					this.socialArray = resp?.data[0]?.social || [];
					console.log("social array",this.socialArray);
					for (let i = 0; i < this.socialArray.length; i++) {
						this.activeSocialConnection[this.socialArray[i].type] = {
							active: this.socialArray[i].isActive,
							_id: this.socialArray[i]?._id
						};
					}
					let telegramCheck = this.socialArray.filter((item) => item.type == this.SOCIAL_CONNECTIONS.TELEGRAM);
					this.isTelegramLinked = telegramCheck?.length ? true : false
					let youtubeCheck = this.socialArray.filter((item) => item.type == this.SOCIAL_CONNECTIONS.YOUTUBE);
					this.isYoutubeLinked = youtubeCheck?.length ? true : false
					let twitterCheck = this.socialArray.filter((item) => item.type == this.SOCIAL_CONNECTIONS.TWITTER);
					this.istwitterLinked = twitterCheck?.length ? true : false
					let discordCheck = this.socialArray.filter((item) => item.type == this.SOCIAL_CONNECTIONS.DISCORD);
					this.isDiscordLinked = discordCheck?.length ? true : false
					console.log("social array check telegram",this.isTelegramLinked);
					console.log("social array check youtube",this.isYoutubeLinked);
					console.log("social array check twitter",this.istwitterLinked);
					console.log("active social connections",this.activeSocialConnection);
				}
			},
			(err) => {
				this.loderService.hide();
				console.log(err);
			}
		);
	}
	
	/**
	 * @description: used to connect social channel
	 * @param value 
	 * @returns 
	 */
	connectSocialChannel(value) {
		let id = JSON.parse(localStorage.getItem('_u'))?._id;
		if (value == this.SOCIAL_CONNECTIONS.YOUTUBE) {
			const token: string = this.commonApi.getToken();
			const user = this.commonApi.getCurrentUserId();
			let headers: any = {
				accountId: user,
				token: token,
			}
			headers = JSON.stringify(headers);
			window.location.href = `${environment.baseURL}auth/v1/google/social?id=${id}&headers=${headers}`;
		}
		else if (value == this.SOCIAL_CONNECTIONS.TWITTER) {
			window.location.href = `${environment.baseURL}auth/v1/twitter/social?id=${id}`;
		}
		else if (value == this.SOCIAL_CONNECTIONS.DISCORD) {
			window.location.href = `${environment.baseURL}auth/v1/discord/social?id=${id}`;
		}
		else {
			return;
		}
	}

	/**
	 * @description: used to check activity of social
	 * @param content 
	 * @param type 
	 * @param socialId 
	 * @param isActive 
	 */
	checkActivityOfSocial(content,type?, socialId?, isActive?) {
		console.log('check activeity type',type);
		console.log('check activity details',this.activeSocialConnection,this.activeSocialConnection[type])
		this.dataToConnectSocial = {
			socailId: this.activeSocialConnection[type]?._id,
			value: !this.activeSocialConnection[type]?.active
		};
		if (this.activeSocialConnection[type]?.active) {
			this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
		}
		else {
			this.connectSocialAccount();
		}
	}

	connectToTwitter(){
		console.log("calling connect to twitter")
	}

	/**
	 * @description: used to close modal and reset variables
	 */
	closeModal() {
		this.modalService.dismissAll();
		this.getActiveSocialConnection();
		this.taskErrorMessage = '';
		this.selectedModalType = '';
	}

	/**
	 * @description: used to connect social account
	 */
	connectSocialAccount() {
		this.loderService.show();
		this.service.updateUserSocialProfile(this.dataToConnectSocial).subscribe(resp => {
			this.loderService.hide();
			if (resp.error) {
				console.log(resp.error);
			} else {
				this.closeModal();
				this.getActiveSocialConnection();
				this.obsService.setMessage("updatedSocialConnection");
				this.toastrService.success(this.constants.SOCIAL_CONNECTION_UPDATE_SUCCESS, this.constants.SUCCESS, {
					timeOut: 3000
				});
			}
		}, error => {
			this.loderService.hide();
			this.toastrService.error(error.error.message ||this.constants.ERROR_UPDATING_SOCIAL_CONNECTION, this.constants.ERROR, {
				timeOut: 3000
			});
		});
	}

	/**
	 * @description: used to handle telegram login
	 * @param event 
	 */
	handleTelegramLogin(event) {
		let data = event;
		this.shoutOutService.loginWithTelegram(data).subscribe(response => {
			this.getActiveSocialConnection();
			if (response.error) {
				this.loderService.hide();
				this.taskErrorMessage = (response?.message || this.constants.SOMETHING_WRONG);
				this.OpenInfoModalForCampaign(this.modalType.ERROR)
			} else {
				this.loderService.hide();
				this.taskErrorMessage = Messages.CONST_MSG.SOCIAL_ADDED_SUCCESSFULLY;
				this.OpenInfoModalForCampaign(this.modalType.SUCCESS)
			}
		}, err => {
			this.loderService.hide();
			this.taskErrorMessage = err.error.message || this.constants.SOMETHING_WRONG;
				this.OpenInfoModalForCampaign(this.modalType.ERROR)
		});
	}

	/**
	 * @description: used to open campaign info modal
	 * @param type 
	 */
	OpenInfoModalForCampaign(type) {
		this.selectedModalType = type;	
		this.modalService.open(this.infoModal, { centered: true ,backdrop: 'static', size:"md", windowClass:"congratulations-popup"});
	}

	/**
	 * @description: used to show change password button
	 */
	goToChangePassword(){
		this.showChangePassword = true;
		this.changePasswordForm.reset();
	}

	/**
	 * @description: used to view profile section
	 */
	goBackToProfileSection(){
		this.showChangePassword = false;
	}

	/**
	 * @description: used to change user password
	 */
	onChangePasswordSubmit(){
		if (this.changePasswordForm.invalid) {
			this.validator.markControlsTouched(this.changePasswordForm)
			return;
		}
		let dataToSend = {
			newPassword: this.password.value,
			confirmPassword: this.confirmPass.value
		}
		this.loderService.show();
		this.service.changeUserPassword(dataToSend).subscribe(resp => {
			this.loderService.hide();
			if (resp?.error) {
				console.log(resp?.error);
				this.toastrService.error(resp?.message)
			} else {
				this.showChangePassword = false;
				this.toastrService.success(this.constants.PASSWORD_CHANGED_SUCCESS);
			}
		}, error => {
			this.loderService.hide();
			this.toastrService.error(error?.error?.message);
		});
	}

	/**
	 * @description: used to show password
	 */
	handleShowPassword() {
		this.showPassword = !this.showPassword
	}

	/**
	 * @description: used to show confirm password
	 */
	handleShowConPassword() {
		this.showConPassword = !this.showConPassword
	}

	/**
	 * @description: on input change function of otp input
	 * @param otp 
	 */
	onOtpChange(otp) {
		console.log(otp)
		this.otp.patchValue(otp);
		console.log(this.otp.value)
	}

	openVerifyOtpModal(content){
		this.otpForm.reset();
		let dataToSend = {
			email: this.userData?.email
		}
		this.loderService.show();
		this.service.sendOtpToVerifyEmail(dataToSend).subscribe((res: any) => {
			this.loderService.hide();
			if (res?.error) {
				this.toastrService.clear();
				this.toastrService.error(res.message, this.constants.ERROR, {
					timeOut: 5000,
				});
			} else {
				// if (res?.data?.emailVerified == true) {
				// 	if (res?.data?.signup == false) {
				// 		this.toastrService.clear()
				// 		this.toastrService.success(this.constants.ACCOUNT_ALREADY_VERIFIED, this.constants.SUCCESS, { timeOut: 2000 });
				// 		this.cookieService.setCookie('otp-email', this.userData.email, 30);
				// 	} else {
				// 		this.toastrService.clear()
				// 		this.toastrService.success(this.constants.YOU_HAVE_ALREADY_CREATED_ACCOUNT_LOGIN_TO_CONTINUE, this.constants.SUCCESS, { timeOut: 2000 })
				// 	}
				// } 
				// else {
					this.toastrService.clear()
					this.toastrService.success(this.constants.PLEASE_CHECK_YOUR_EMAIL, this.constants.SUCCESS, { timeOut: 2000 })
					this.cookieService.setCookie('otp-email', this.userData.email, 30);
					this.modalService.open(content, { centered: true ,backdrop: 'static', size:"lg", windowClass:"verfy-new-popup"});
				// }
			}
		}, err => {
			this.loderService.hide();
			this.toastrService.clear();
			this.toastrService.error(err?.error?.message, this.constants.ERROR, {
				timeOut: 5000,
			});
		});
	}

	/**
	 * @description: used to verify otp
	 * @param value otp entered
	 */
	verifyOtp(value,content) {
		if (this.otpForm.invalid) {
			this.validator.markControlsTouched(this.otpForm)
			return;
		}
		value.email = this.cookieService.get('otp-email');
		this.loderService.show();
		this.authService.verifyOtp(value).subscribe((res: any) => {
			this.loderService.hide();
			if (res?.error) {
				this.toastrService.clear()
				this.toastrService.error(res.message);
			} else {
				// this.toastrService.success(this.constants.VERIFICATION_SUCCESSFULL, this.constants.SUCCESS, { timeOut: 2000 })
				// this.modalService.dismissAll();
				this.showOtpSuccess = true;
				// this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })

				console.log("show otp success",this.showOtpSuccess);
				this.cookieService.deleteCookie('otp-email');
				this.cookieService.setCookie('firsttimelogin', true, 365);
				this.userObj.emailVerified = true;
				window.localStorage.setItem('_u', JSON.stringify(this.userObj));
				let updatedUser = this.commonApi.getCurrentUser();
				console.log("updated user",updatedUser);
				this.obsService.setProfileVerify(true);

			}
		}, err => {
			this.loderService.hide();
			this.toastrService.clear();
			this.toastrService.error(err.error.message, this.constants.ERROR, {
				timeOut: 5000,
			});
		});
	}

	/**
	 * @description: used to resend email for otp
	 */
	resendEmail() {
		let email = this.cookieService.get('otp-email');
		this.loderService.show();
		this.authService.sendSignupOtp({ email: email, resend: true }).subscribe((res: any) => {
			this.loderService.hide();
			if (res?.error) {
				this.toastrService.clear();
				this.toastrService.error(res.message);
			} else {
				this.toastrService.success(this.constants.PLEASE_CHECK_YOUR_EMAIL, this.constants.SUCCESS, { timeOut: 2000 });
			}
		}, err => {
			this.loderService.hide();
			this.toastrService.clear();
			this.toastrService.error(err.error.message, this.constants.ERROR, {
				timeOut: 5000,
			});

		});
	}
	// connectWallet(walletConnectPopup) {
	// 	this.modalService.open(walletConnectPopup, { centered: true, size: 'md', windowClass:"wallet-connect-popup", backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
	// }
	connectWallet() {
		
		this.router.navigate(['settings/wallet'])
		// this.modalService.open(walletConnectPopup, { centered: true, size: 'md', windowClass:"wallet-connect-popup", backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
	}
	closePopup() {
		this.modalService.dismissAll();
	}	
}