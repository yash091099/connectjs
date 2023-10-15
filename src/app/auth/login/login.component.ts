import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService, LoaderService } from 'src/app/shared/services';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormValidatorService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CookiesService } from 'src/app/shared/services/cookies.service';
import { Title } from '@angular/platform-browser';
import { Messages } from 'src/app/config/message';
import noWhitespaceValidator from 'src/app/shared/services/no-white-space-validator.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import forbiddenEmailValidation from 'src/app/shared/services/email-validator.service';

declare var sliderCaptcha: any;
declare var $: any;
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@ViewChild('captchaCheckbox') captchaCheckbox: any;
	/**Form Group */
	public loginForm: FormGroup;
	/**Variable */
	public YOUR_SITE_KEY = environment.SITE_KEY;
	sponsorId: any;
	/**Boolean */
	public captchaVerify = false;
	public showPassword = false;
	/**Constant */
	constants = Messages.CONST_MSG;
code :any
sliders: any 
	constructor(
		private toastrService: ToastrService,
		private cookieService: CookiesService,
		private authservice: AuthService,
		public router: Router,
		public shared: CommonApiService,
		private validator: FormValidatorService,
		public fb: FormBuilder,
		private loaderservice: LoaderService,
		public route: ActivatedRoute,
		private titleService: Title,
		private modalService: NgbModal
	) { }

	ngOnInit(): void {
		
		console.log("login page")
		this.titleService.setTitle("Login | TDX Launchpad");
		this.loaderservice.hide();
		this.createForm();
		this.route.params.subscribe((params) => {
			if(params['sponsor']){
				this.sponsorId = params['sponsor'];
				this.verifyReferralLink(this.sponsorId);
			}
			else if ((params['data']) && (params['type'])) {
				this.loginForm.patchValue({
					email: atob(params['data'])
				})
			} else {
				if (params['data']) {
					let data: any = atob(params['data']);
					data = JSON.parse(data);
					this.shared.setUserLoggedIn(data.data);
					if (localStorage.getItem('projectId')) {
						let projectName = localStorage.getItem('projectName');
						let projectId = localStorage.getItem('projectId');
						this.router.navigate([`shout-out/project/${projectName}/${projectId}`]);

					} else {
						this.router.navigate(['/launchpad']);
					}
				}
			}
		})
	}



	/**
	 * @description: used to create login form
	 */
	createForm() {
		this.loginForm = this.fb.group({
			email: new FormControl('', [Validators.required, forbiddenEmailValidation]),
			password: new FormControl('', [Validators.required,noWhitespaceValidator, Validators.minLength(8)]),
		})
	}
	get email() { return this.loginForm.get('email'); }
	get password() { return this.loginForm.get('password'); }

	/**
	 * @description: resolved function of re-captcha 
	 * @param captchaResponse 
	 */
	
	/**
	 * @description: used to login user
	 * @param value user's email & password
	 */

	loginUser(value) {
		// this.validateCaptcha()
		if (this.loginForm.invalid) {
			this.validator.markControlsTouched(this.loginForm)
			return;
		}
	
		if (!this.captchaVerify) {
			this.toastrService.clear();
			this.toastrService.error(this.constants.PLEASE_VERIFY_CAPTCHA, this.constants.ERROR, {
				timeOut: 5000,
			});
			return;
		}

	

		let DTS = {
			provider: 'email',
			password: btoa(value.password),
			email: value.email,
			myRecaptcha: this.captchaVerify

		}
		this.loaderservice.show();
		this.authservice.login(DTS).subscribe((res: any) => {
			this.loaderservice.hide();
			if (res.error) {
				this.toastrService.clear();
				this.toastrService.error(res.message, this.constants.ERROR, {
					timeOut: 5000,
				});
			} else {
				if (res.data.user.role == this.constants.USER) {
					this.shared.setUserLoggedIn(res.data);
					if (localStorage.getItem('projectId')) {
						let projectName = localStorage.getItem('projectName');
						let projectId = localStorage.getItem('projectId');
						this.router.navigate([`shout-out/project/${projectName}/${projectId}`]);

					} else {
						this.router.navigate(['/launchpad']);
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
				this.cookieService.setCookie('otp-email', value.email, 10 * 365);
				this.router.navigate(['auth/all-signup']);
			}
		});
	}

	/**
	 * @description: used to social login
	 * @param type 
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
		window.location.href = environment.baseURL + 'auth/v1/' + url;
	}

	/**
	 * @description: used to show/hide password
	 */
	handleShowPassword() {
		console.log(this.showPassword)
		this.showPassword = !this.showPassword
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

	verifyReferralLink(sponsor) {
		this.authservice.verifyReferralLink({ sponsor: sponsor }).subscribe((res: any) => {
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
					this.authservice.updateReferralLinkVisit({ sponsor: sponsor }).subscribe((res: any) => {
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
	redirectToSignup(){
		if(this.sponsorId){
			this.router.navigate(['/auth/all-signup',this.sponsorId])
		}
		else{
			this.router.navigate(['/auth/all-signup'])
		}
	}

}
