import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonApiService, LoaderService, MessageService, FormValidatorService } from 'src/app/shared/services';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookiesService } from 'src/app/shared/services/cookies.service';
import { Title } from '@angular/platform-browser';
import { Messages } from 'src/app/config/message';
import forbiddenEmailValidation from 'src/app/shared/services/email-validator.service';

@Component({
	selector: 'app-social',
	templateUrl: './social.component.html',
	styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {
	/**Form Group */
	public socialSignupForm: FormGroup;
	/**Object */
	public userObj: any = {};
	/**Boolean */
	public userNameError = false;
	public showProfileForm = false;
	public checkFirstName = false;
	public checkLastName = false;
	public stateTwo = false;
	public showNextButton = false;
	tncChecked = false
	/**Variable */
	errorMessage = null;
	/**Array */
	public sectorsOfInterestLists = [
		{
			label: 'Finance & Banking',
			selected: false
		},
		{
			label: 'Energy & Mining',
			selected: false
		},
		{
			label: 'Real Estate & Property ',
			selected: false
		},
		{
			label: 'IT & Telecommunications',
			selected: false
		},

		{
			label: 'Renewable Energy',
			selected: false
		},
		{
			label: 'Manufacturing',
			selected: false
		},
		{
			label: 'Tourism & Hospitality',
			selected: false
		},
		{
			label: 'Healthcare & Pharmaceutical',
			selected: false
		},
		{
			label: 'Gaming-Gambling',
			selected: false
		},
		{
			label: 'Infrastructure & Logistics - Trade & Industry',
			selected: false
		},
	]

	constructor(
		public route: ActivatedRoute,
		public router: Router,
		public shared: CommonApiService,
		private loaderservice: LoaderService,
		public fb: FormBuilder,
		private validator: FormValidatorService,
		public authService: AuthService,
		private messageService: MessageService,
		private cookieService: CookiesService,
		private toasterService: ToastrService,
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.titleService.setTitle("TDX Launchpad | Complete Profile");
		this.createForm();
		this.loaderservice.show();
		this.route.params.subscribe((params) => {
			if (params['data']) {
				let data: any = atob(params['data']);
				this.userObj = JSON.parse(data);
				console.log(this.userObj)
				if (this.userObj.error) {

					if ((this.userObj.data)) {
						let data = this.userObj.data;
						if ((data.emailVerified == true) && (data.signup == false)) {
							this.cookieService.deleteCookie('otp-email');
							this.cookieService.setCookie('otp-email', data.email, 10 * 365);
							this.router.navigate(['auth/all-signup']);
						} else {
							this.toasterService.error(this.userObj.message, 'Error', {
								timeOut: 1500,
							});
							let that = this;
							setTimeout(function () {
								that.router.navigate(['auth/login']);
							}, 1500);
						}
					} else {
						this.toasterService.error(this.userObj.message, 'Error', {
							timeOut: 1500,
						});
						let that = this;
						setTimeout(function () {
							that.router.navigate(['auth/login']);
						}, 1500);
					}
				} else {

					if ((this.userObj.data) && (this.userObj.data.user)) {
						let user = this.userObj.data.user;
						if (user.signup == true) {
							this.showProfileForm = false;
							this.shared.setUserLoggedIn(this.userObj.data);
							if (localStorage.getItem('projectId')) {
								let projectName = localStorage.getItem('projectName');
								let projectId = localStorage.getItem('projectId');
								this.router.navigate([`shout-out/project/${projectName}/${projectId}`]);

							} else {
								this.router.navigate(['/launchpad']);
							}
						} else {
							this.showProfileForm = true;
							this.loaderservice.hide();
							if (user.email) {
								this.email.disable();
							}
							let name = user?.name.split(" ")
							let lastname = ''
							name.forEach((item, i) => {
								if (i != 0) {
									lastname = lastname + ' ' + item
								}
							})
							this.socialSignupForm.patchValue({
								email: user.email,
								firstname: name[0],
								lastname: lastname

							});
						}
					} else {

						this.toasterService.error(Messages.CONST_MSG.SOME_ERROR_OCCUR, 'Error', {
							timeOut: 1000,
						});
						let that = this;
						setTimeout(function () {
							that.router.navigate(['auth/login']);
						}, 1000)
					}
				}

			}
		})
	}

	/**
	 * @description: used to create social signup form
	 */
	createForm() {
		this.socialSignupForm = this.fb.group({
			email: new FormControl('', [Validators.required,forbiddenEmailValidation]),
			firstname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
			lastname: new FormControl(''),
			investor: new FormControl(false),
			agreeTNC: new FormControl(false),
			investmentRange: new FormControl(null),
			investorType: new FormControl(null),
			investmentIn: new FormControl(null),
			socialLink: new FormControl(null),
			telegramId: new FormControl(null),
			selectedIntrested: this.fb.array([]),

		})
	}
	get email() { return this.socialSignupForm.get('email'); }
	get firstname() { return this.socialSignupForm.get('firstname'); }
	get lastname() { return this.socialSignupForm.get('lastname'); }
	get agreeTNC() { return this.socialSignupForm.get('agreeTNC'); }
	get investor() { return this.socialSignupForm.get('investor'); }
	get telegramId() { return this.socialSignupForm.get('telegramId'); }
	get selectedIntrested() { return this.socialSignupForm.get('selectedIntrested'); }

	/**
	 * @description: on checkbox change of sectors of interest
	 * @param e 
	 */
	onCheckboxChange(e) {
		const checkArray: FormArray = this.socialSignupForm.get('selectedIntrested') as FormArray;

		if (e.target.checked) {
			checkArray.push(new FormControl(e.target.value));
		} else {
			let i: number = 0;
			checkArray.controls.forEach((item: FormControl) => {
				if (item.value == e.target.value) {
					checkArray.removeAt(i);
					return;
				}
				i++;
			});
		}
	}

	/**
	 * @description: used to update social account
	 * @param value user's email & usename (obj)
	 */
	updateSocial(value) {
		this.resetErrorMessage()
		if (this.socialSignupForm.invalid) {
			console.log("form not valid", this.email.valid, this.firstname.valid, this.lastname.valid)
			this.validator.markControlsTouched(this.socialSignupForm)
			return;
		}
		if (this.checkFirstName) {
			this.socialSignupForm.setErrors({ 'invalid': true });
			return;
		}
		if (this.checkLastName) {
			this.socialSignupForm.setErrors({ 'invalid': true });
			return;
		}

		if (this.userNameError == false) {
			if (this.userObj?.data?.user?.email) {
				value.email = this.userObj?.data?.user?.email;
			}
			value.token = this.userObj?.data?.token;
			value.userid = this.userObj?.data?.user?.accountId;
			this.loaderservice.show();
			this.authService.socialUpdate(value).subscribe((res: any) => {
				this.messageService.error('')
				this.loaderservice.hide();
				if (res.error) {
					this.messageService.error(res.message);
				} else {
					this.cookieService.deleteCookie('sponsor');
					this.cookieService.deleteCookie('link');
					this.cookieService.deleteCookie('fromSponsor');
					this.userObj.data.user.userName = value?.userName;
					this.shared.setUserLoggedIn(this.userObj?.data);
					if (localStorage.getItem('projectId')) {
						let projectName = localStorage.getItem('projectName');
						let projectId = localStorage.getItem('projectId');
						this.router.navigate([`shout-out/project/${projectName}/${projectId}`]);

					} else {
						this.router.navigate(['/shout-out']);

					}
					this.cookieService.setCookie('firsttimelogin', true, 365);
				}
			}, err => {
				this.loaderservice.hide();
				this.toasterService.clear()
				this.toasterService.error(err.error.message);
			});
		}

	}
	/**
	 * @description: used to reset error message
	 */
	resetErrorMessage() {
		this.messageService.error('')
	}
	/**
   * @description: on blur function of first and last name
   * @param name regex for number
   */
	onBlur(name) {
		this.resetErrorMessage()
		var regex = /\d/g;
		if (name == 'firstName') {
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
	 * @description: on change function of terms and conditions checkbox
	 * @param $event 
	 */
	handleTNCCheck($event) {
		this.tncChecked = $event.target.checked
	}
}