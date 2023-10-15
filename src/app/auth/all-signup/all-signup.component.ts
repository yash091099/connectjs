import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonApiService, FormValidatorService, LoaderService, MessageService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { CookiesService } from 'src/app/shared/services/cookies.service';
import { Title } from '@angular/platform-browser';
import { Messages } from 'src/app/config/message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import forbiddenEmailValidation from 'src/app/shared/services/email-validator.service';
declare var sliderCaptcha: any;
declare var $: any;
@Component({
	selector: 'app-all-signup',
	templateUrl: './all-signup.component.html',
	styleUrls: ['./all-signup.component.css']
})
export class AllSignupComponent implements OnInit {
	/**Form Group */
	@ViewChild('captchaCheckbox') captchaCheckbox: any;
	public signupForm: FormGroup;
	/**Variable */
	public YOUR_SITE_KEY = environment.SITE_KEY;
	/**Boolean */
	public captchaVerify = false;
	public checkFirstName = false;
	public checkLastName = false;
	showPassword = false
	showConPassword = false
	tncChecked = false
	formValid = true;
	InvalidForm = false;
	style:any
	 sliders:any
	/**Constant */
	constants = Messages.CONST_MSG;

	constructor(
		private titleService: Title,
		private cookieService: CookiesService,
		public route: ActivatedRoute,
		private authService: AuthService,
		private toastrService: ToastrService,
		public fb: FormBuilder,
		public router: Router,
		private validator: FormValidatorService,
		private loaderservice: LoaderService,
		private messageService: MessageService,
		private shared: CommonApiService,
		private modalService: NgbModal

	) { }

	ngOnInit(): void {
		
		

		this.titleService.setTitle("TDX Launchpad | SignUp");
		this.createForm();
		this.cookieService.deleteCookie('otp-email');
		this.route.params.subscribe((params) => {
			console.log(params, "params")
			let now = new Date();
			now.setHours(now.getHours() + 8);
			if (params['sponsor']) {
				let sponsor = params['sponsor'];
				this.verifyReferralLink(sponsor);
			}
		});
	}

	/**
	 * @description: used to update verify sponsor referral link
	 * @param sponsor 
	 */
	verifyReferralLink(sponsor) {
		this.authService.verifyReferralLink({ sponsor: sponsor }).subscribe((res: any) => {
			if (res.error) {
				this.cookieService.deleteCookie('sponsor');
				this.cookieService.setCookie('fromSponsor', 'false', 10 * 365);
			} else {
				this.cookieService.setCookie('sponsor', sponsor, 10 * 365);
				this.cookieService.setCookie('fromSponsor', 'true', 10 * 365);
				var linkIndex = -1;
				var visitedLinks: any = [];
				visitedLinks = this.cookieService.get('visitedRef') ? JSON.parse(this.cookieService.get('visitedRef')) : [];
				for (var i = 0; i < visitedLinks.length; i++) {
					if (visitedLinks[i].sponsor === sponsor) {
						linkIndex = i;
						break;
					}
				}
				if (linkIndex === -1) {
					this.authService.updateReferralLinkVisit({ sponsor: sponsor }).subscribe((res: any) => {
						if (res.error) {
							console.log('-----', res.message)
						} else {
							var query: any = { sponsor: sponsor };
							visitedLinks.push(query);
							this.cookieService.setCookie('visitedRef', JSON.stringify(visitedLinks), 10 * 365);
						}
					}, err => {
						this.cookieService.deleteCookie('sponsor');
						this.cookieService.setCookie('fromSponsor', 'false', 10 * 365);
						console.log('-----', err.error.message)
					});
				} else {
					console.log('Link is already visited');
				}
			}
		}, err => {
			console.log('-----', err.error.message)
		});
	}

	/**
	 * @description: used to create signup form
	 */
	createForm() {
		this.signupForm = this.fb.group({
			firstname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
			lastname: new FormControl(''),
			password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]),
			confirm: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, forbiddenEmailValidation]),
			agreeTNC: new FormControl(false),
		})
	}
	get firstname() { return this.signupForm.get('firstname'); }
	get lastname() { return this.signupForm.get('lastname'); }
	get userName() { return this.signupForm.get('userName'); }
	get password() { return this.signupForm.get('password'); }
	get confirm() { return this.signupForm.get('confirm'); }
	get email() { return this.signupForm.get('email'); }
	get agreeTNC() { return this.signupForm.get('agreeTNC'); }

	/**
	 * @description: used to signup and send otp to verify email
	 * @param value: signup form value 
	 */
	sendOtp(value) {
		this.formValid = false;
		if (this.signupForm.invalid) {
			this.validator.markControlsTouched(this.signupForm);
			this.InvalidForm = true;
			return;
		}
		if (value.password != value.confirm) {
			this.messageService.error(this.constants.CONFIRM_PASSWORD_MISMATCH);
			this.InvalidForm = true;
			return;
		} else {
			this.messageService.error('');
		}

		if (this.checkFirstName) {
			this.signupForm.setErrors({ 'invalid': true });
			this.InvalidForm = true;
			return;
		}
		if (this.checkLastName) {
			this.signupForm.setErrors({ 'invalid': true });
			this.InvalidForm = true;
			return;
		}
		if (!this.captchaVerify) {
			this.InvalidForm = true;
			return;
		}
		if (!this.tncChecked) {
			this.InvalidForm = true;
			return;
		}
		this.InvalidForm = false;
		let isReferral = this.cookieService.get('fromSponsor');
		if (isReferral == this.constants.TRUE) {
			let sponsor = this.cookieService.get('sponsor');
			if (sponsor) {
				value.sponsor = sponsor;
			}
		}
		value.myRecaptcha = this.captchaVerify
		this.loaderservice.show();
		this.authService.sendSignupOtp(value).subscribe((res: any) => {
			this.loaderservice.hide();
			if (res.error) {
				this.toastrService.clear();
				this.toastrService.error(res.message, this.constants.ERROR, {
					timeOut: 5000,
				});
			} else {
				this.cookieService.setCookie('sponsor', '', -1);
				this.cookieService.setCookie('fromSponsor', '', -1);
				// if (res.data.emailVerified == true) {
				// 	if (res.data.signup == false) {
				// 		this.toastrService.clear()
				// 		this.toastrService.success(this.constants.ACCOUNT_ALREADY_VERIFIED, this.constants.SUCCESS, { timeOut: 2000 });
				// 		this.cookieService.setCookie('otp-email', value.email, 30);
				// 		this.router.navigate(['auth/login']);
				// 	} else {
				// 		this.toastrService.clear()
				// 		this.toastrService.success(this.constants.YOU_HAVE_ALREADY_CREATED_ACCOUNT_LOGIN_TO_CONTINUE, this.constants.SUCCESS, { timeOut: 2000 })
				// 	}
				// }
				if(res?.data?.emailVerified == false && res?.data?.signup == false){
					console.log("coming in first block");
					this.toastrService.clear()
					// this.toastrService.success(this.constants.PLEASE_CHECK_YOUR_EMAIL, this.constants.SUCCESS, { timeOut: 2000 })
					this.cookieService.setCookie('otp-email', value.email, 30);
					value.password = btoa(value.password)
					value.confirm = btoa(value.confirm)
					let dataToSave = {
						...value
					}
					this.shared.setUserLoginDetails(JSON.stringify(dataToSave))
					this.completeUserProfile();
				}
				if (res?.data?.emailVerified == true && res?.data?.signup == true) {
					this.toastrService.clear()
					this.toastrService.error(this.constants.YOU_HAVE_ALREADY_CREATED_ACCOUNT_LOGIN_TO_CONTINUE, this.constants.ERROR, { timeOut: 2000 })
				} 
				if(res?.data?.emailVerified == false && res?.data?.signup == true){
						this.toastrService.clear()
						this.toastrService.error(this.constants.ACCOUNT_ALREADY_VERIFIED, this.constants.ERROR, { timeOut: 2000 });
						this.cookieService.setCookie('otp-email', value.email, 30);
				}
				// else {
				// 	this.toastrService.clear()
				// 	// this.toastrService.success(this.constants.PLEASE_CHECK_YOUR_EMAIL, this.constants.SUCCESS, { timeOut: 2000 })
				// 	this.cookieService.setCookie('otp-email', value.email, 30);
				// 	value.password = btoa(value.password)
				// 	value.confirm = btoa(value.confirm)
				// 	let dataToSave = {
				// 		...value
				// 	}
				// 	this.shared.setUserLoginDetails(JSON.stringify(dataToSave))
				// 	this.completeUserProfile();
				// 	// this.router.navigate(['auth/otp-verification']);
				// }
			}
		}, err => {
			this.loaderservice.hide();
			this.toastrService.clear();
			this.toastrService.error(err.error.message, this.constants.ERROR, {
				timeOut: 5000,
			});
		});
	}

/**
 * @description: used to complete user's profile after otp verification
 */
completeUserProfile() {
	let DTS = JSON.parse(localStorage.getItem('loginDetails'))
	DTS.provider = 'email',
	this.loaderservice.show();
	this.authService.completeProfile(DTS).subscribe((res: any) => {
		this.loaderservice.hide();
		if (res.error) {
			this.toastrService.clear();
			this.toastrService.error(res.message, this.constants.ERROR, {
				timeOut: 5000,
			});
		} else {
			console.log("signup response",res);
			if (res.data.user.role == 'user') {
				this.shared.setUserLoggedIn(res.data);
				if (localStorage.getItem('projectId')) {
					let projectName = localStorage.getItem('projectName');
					let projectId = localStorage.getItem('projectId');
					this.router.navigate([`shout-out/project/${projectName}/${projectId}`]);

				} else {
					let path = '/shout-out';
					window.location.href = path;
				}
			} else {
				this.toastrService.clear();
				this.toastrService.error(this.constants.NO_ACCESS_ALLOWED);
			}
			// this.logInUser()
		}
	}, err => {
		this.loaderservice.hide();
		this.toastrService.clear();
		this.toastrService.error(err.error.message);
	});
}

/**
 * @description: used to login user to the panel
 */
logInUser() {
	let userDetails = JSON.parse(localStorage.getItem('loginDetails'))
	let DTS: any = {
		email: userDetails?.email,
		password: userDetails?.password
	}
	DTS.provider = 'email',
	this.loaderservice.show();
	this.authService.login(DTS).subscribe((res: any) => {
		this.loaderservice.hide();
		if (res.error) {
			this.toastrService.clear();
			this.toastrService.error(res.message, this.constants.ERROR, {
				timeOut: 5000,
			});
		} else {

			if (res.data.user.role == 'user') {
				this.shared.setUserLoggedIn(res.data);
				if (localStorage.getItem('projectId')) {
					let projectName = localStorage.getItem('projectName');
					let projectId = localStorage.getItem('projectId');
					this.router.navigate([`shout-out/project/${projectName}/${projectId}`]);

				} else {
					let path = '/shout-out';
					window.location.href = path;
				}
			} else {
				this.toastrService.clear();
				this.toastrService.error(this.constants.NO_ACCESS_ALLOWED);
			}

		}
	}, err => {
		this.loaderservice.hide();
		this.toastrService.clear();
		this.toastrService.error(err.error.message);
		let data = err.error?.data;
		if ((data?.emailVerified == true) && (data?.signup == false)) {
			this.cookieService.deleteCookie('otp-email');
			this.cookieService.setCookie('otp-email', data.email, 10 * 365);
			this.router.navigate(['auth/all-signup']);
		}
	});

	}

	/**
	 * @description: resolved function of re-captcha
	 * @param captchaResponse: re-captcha response 
	 */
	// resolved(captchaResponse: string) {
	// 	this.authService.verifyGoogleCaptcha({ captchaResponse: captchaResponse }).subscribe((res: any) => {
	// 		this.loaderservice.hide();
	// 		if (!res.error) {
	// 			this.captchaVerify = true;
	// 		} else {
	// 			this.captchaVerify = false;
	// 		}
	// 	}, err => {
	// 		this.captchaVerify = false;
	// 		this.loaderservice.hide();
	// 		this.toastrService.clear();
	// 		this.toastrService.error(err.error.message, this.constants.ERROR, {
	// 			timeOut: 5000,
	// 		});
	// 	});
	// }

	/**
   * @description: used to social login
   */
	socialLogin(type) {
		let url = "";
		if (type == 1) {
			url = 'google';
		} else if (type == 2) {
			url = 'facebook';
		} else if (type == 3) {
			url = 'linkedin';
		}
		let redirection = environment.baseURL + 'auth/v1/' + url
		let isReferral = this.cookieService.get('fromSponsor');
		if (isReferral == this.constants.TRUE) {
			let sponsor = this.cookieService.get('sponsor');
			if (sponsor) {
				redirection = redirection + `?sponsor=${sponsor}`
			}
		}
		window.location.href = redirection ;	
	}

	/**
   * 
   * @param name regex for number
   */
	onBlur(name) {
		var regex = /\d/g;
		if (name == this.constants.FIRST_NAME) {
			if (regex.test(this.firstname.value)) {
				this.checkFirstName = true
			} else {
				this.checkFirstName = false

			}

		} else {
			if (regex.test(this.lastname.value)) {
				this.checkLastName = true
			} else {
				this.checkLastName = false

			}

		}
	}
	/**
	 * @description: used to show/hide password
	 */
	handleShowPassword() {
		this.showPassword = !this.showPassword
	}
	/**
	 * @description: used to show/hide confirm password
	 */
	handleShowConPassword() {
		this.showConPassword = !this.showConPassword
	}
	/**
	 * @description: on change function of password and confirm password match validation
	 */
	checkConfirmPassword() {
		this.messageService.error('');
		if (this.password.value && this.confirm.value) {
			if (this.password.value != this.confirm.value) {
				this.messageService.error(this.constants.CONFIRM_PASSWORD_MISMATCH);
			}
			else {
				this.messageService.error('')
			}
		}
	}
	/**
	 * @description: on change function of terms and conditions checkbox
	 * @param $event 
	 */
	handleTNCCheck($event) {
		this.tncChecked = $event.target.checked
	}

	closeAllPopup(){
		console.log(this.captchaVerify)
		if(!this.captchaVerify){
			
			this.captchaCheckbox.nativeElement.checked = false;
		}
		this.modalService.dismissAll()

	}

	openSlider(content) {
        const modalRef = this.modalService.open(content, { size: 'md', centered: true, windowClass: 'slider-capcha',backdrop: 'static', });

        modalRef.result.then((result) => {
            if (result === 'closedByBackdrop') {
                // Modal closed by clicking outside, uncheck the checkbox
                this.captchaCheckbox.nativeElement.checked = false;
            }
        });

        const captcha = sliderCaptcha({
            id: 'sliderCap',
            repeatIcon: 'fa fa-redo',
            onSuccess: () => {
                this.captchaVerify = true;
                console.log('Captcha verified successfully');
                this.toastrService.success('Captcha Verified Successfully');
                this.sliders = document.getElementsByClassName('slider');
                for (let i = 0; i < this.sliders.length; i++) {
                    this.sliders[i].style.display = 'none';
                }

                // Close all modals and disable the checkbox
                this.modalService.dismissAll();
                this.captchaCheckbox.nativeElement.disabled = true;
                return;
            }
        });
    }
	
}
