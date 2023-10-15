import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FormValidatorService, LoaderService, MessageService } from 'src/app/shared/services';
import { AuthService } from '../services/auth.service';
import { CommonApiService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { CookiesService } from 'src/app/shared/services/cookies.service';
import { Title } from '@angular/platform-browser';
import { Messages } from 'src/app/config/message';
import forbiddenEmailValidation from 'src/app/shared/services/email-validator.service';
@Component({
	selector: 'app-profile-complete',
	templateUrl: './profile-complete.component.html',
	styleUrls: ['./profile-complete.component.css']
})
export class ProfileCompleteComponent implements OnInit {
	/**Form Group */
	public profileCompleteForm: FormGroup;
	/**Boolean */
	public userNameError = false;
	public checkFirstName = false;
	public checkLastName = false;
	public stateTwo = false;
	public showNextButton = false;
	/**Variable */
	public userNameErrorMessage = "";
	public errorMessage = null;
	/**Constant */
	constants = Messages.CONST_MSG;
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
		private toastrService: ToastrService,
		public fb: FormBuilder,
		public router: Router,
		private validator: FormValidatorService,
		public authService: AuthService,
		private cookieService: CookiesService,
		public shared: CommonApiService,
		private loaderservice: LoaderService,
		private messageService: MessageService,
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.titleService.setTitle("Complete Profile");
		this.loaderservice.hide();
		this.createForm();
		let email = this.cookieService.get('otp-email');
		if (!email) {
			this.router.navigate(['auth']);
		}
		let investor = this.cookieService.get('isInvestor');
		if (investor == this.constants.TRUE) {
			this.profileCompleteForm.patchValue({
				investor: true
			});
		}
		this.profileCompleteForm.patchValue({
			email: this.cookieService.get('otp-email')
		});
		this.profileCompleteForm.controls['email'].disable();
	}

	/**
	 * @description: on change check function of sectors of interest
	 * @param e : sectors of interest value
	 */
	onCheckboxChange(e) {
		const checkArray: FormArray = this.profileCompleteForm.get('selectedIntrested') as FormArray;

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
	 * @description: used to create profile complete form
	 */
	createForm() {
		this.profileCompleteForm = this.fb.group({
			firstname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
			lastname: new FormControl(''),
			email: new FormControl('', [Validators.required,forbiddenEmailValidation]),
			userName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
			password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]),
			confirm: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]),
			provider: new FormControl('email', [Validators.required]),
			investor: new FormControl(false),
			investmentRange: new FormControl(null),
			investorType: new FormControl(null),
			investmentIn: new FormControl(null),
			socialLink: new FormControl(null),
			telegramId: new FormControl(null),
			selectedIntrested: this.fb.array([])
		})
	}

	get firstname() { return this.profileCompleteForm.get('firstname'); }
	get lastname() { return this.profileCompleteForm.get('lastname'); }
	get userName() { return this.profileCompleteForm.get('userName'); }
	get password() { return this.profileCompleteForm.get('password'); }
	get confirm() { return this.profileCompleteForm.get('confirm'); }
	get email() { return this.profileCompleteForm.get('email'); }
	get investor() { return this.profileCompleteForm.get('investor'); }
	get telegram() { return this.profileCompleteForm.get('telegramId'); }
	get selectedIntrested() { return this.profileCompleteForm.get('selectedIntrested'); }

	/**
	 * @description: on change function of investor checkbox
	 */
	checkForInvestor() {
		console.log(this.investor.value);
		this.showNextButton = this.investor.value;
	}
	/**
	 * @description: used to go to state two
	 */
	goToStateTwo() {
		//check for existing username
		if (this.userName.status == this.constants.INVALID) {
			return;
		}
		this.userNameError = false;
		let username = this.userName.value;
		this.authService.checkForUsername({ userName: username }).subscribe((res: any) => {
			if (res.error) {
				this.userNameError = true;
				this.userNameErrorMessage = res.message;
			} else {
				this.userNameError = false;

				//redirect to state two
				this.stateTwo = true;
			}
		}, err => {
			this.userNameError = true;
			this.userNameErrorMessage = err.error.message;
		});
	}

	/**
	 * @description: on blur function of user name input
	 */
	checkForUserName() {
		if (this.userName.status == this.constants.INVALID) {
			return;
		}
		this.userNameError = false;
		let username = this.userName.value;
		this.authService.checkForUsername({ userName: username }).subscribe((res: any) => {
			if (res.error) {
				this.userNameError = true;
				this.userNameErrorMessage = res.message;
				return;
			} else {
				this.userNameError = false;
			}
		}, err => {
			this.userNameError = true;
			this.userNameErrorMessage = err.error.message;
			return;
		});
	}

	/**
	 * @description: used to submit profile complete form
	 * @param value profile form value
	 */
	submitForm(value) {
		if (this.profileCompleteForm.invalid) {
			this.validator.markControlsTouched(this.profileCompleteForm)
			return;
		}
		if (this.investor.value) {

			if (!value.investmentRange || !value.investorType || !value.investmentIn || (this.selectedIntrested.value.length == 0)) {
				let that = this;
				this.errorMessage = this.constants.PLEASE_ANSWER_ALL_QUESTIONS;
				setTimeout(() => {
					that.errorMessage = null;
				}, 3000);
				return;
			}
		}
		if (value.password != value.confirm) {
			this.messageService.error(this.constants.CONFIRM_PASSWORD_MISMATCH);
			return;
		}

		if (this.checkFirstName) {
			this.profileCompleteForm.setErrors({ 'invalid': true });
			return;
		}
		if (this.checkLastName) {
			this.profileCompleteForm.setErrors({ 'invalid': true });
			return;
		}

		value.name = value.firstname + ' ' + value.lastname
		value.password = btoa(value.password);
		value.confirm = btoa(value.confirm);
		value.email = this.cookieService.get('otp-email');
		if (this.userNameError == false) {
			this.loaderservice.show();
			this.authService.completeProfile(value).subscribe((res: any) => {
				this.loaderservice.hide();
				if (res.error) {
					this.toastrService.clear();
					this.toastrService.error(res.message, this.constants.ERROR, {
						timeOut: 3000,
					});
				} else {
					this.shared.setUserLoggedIn(res.data);
					this.cookieService.deleteCookie('otp-email');
					this.cookieService.deleteCookie('isInvestor');
					if (localStorage.getItem('projectId')) {
						let projectName = localStorage.getItem('projectName');
						let projectId = localStorage.getItem('projectId');
						this.router.navigate([`shout-out/project/${projectName}/${projectId}`]);

					} else {
						let path = '/shout-out';
						window.location.href = path;
					}
					this.cookieService.setCookie('firsttimelogin', true, 365);
				}
			}, err => {
				this.loaderservice.hide();
				this.toastrService.clear();
				this.toastrService.error(err.error.message, this.constants.ERROR, {
					timeOut: 3000,
				});
			});
		}
	}
	/**
	 * @description: on blur function of first name and last name
	 * @param name regex for number
	 */
	onBlur(name) {
		var regex = /\d/g;
		if (name == this.constants.FIRST_NAME) {
			this.checkFirstName = regex.test(this.firstname.value);
		} else {
			this.checkLastName = regex.test(this.lastname.value);
		}
	}
}
