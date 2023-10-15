import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormValidatorService, LoaderService, MessageService } from 'src/app/shared/services';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { Messages } from 'src/app/config/message';
import noWhitespaceValidator from 'src/app/shared/services/no-white-space-validator.service';
@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
	/**Form Group */
	public changePasswordForm: FormGroup;
	/**String */
	public token = '';
	/**Boolean */
	public showPassword = false;
	public showConPassword = false;
	/**Constant */
	constants = Messages.CONST_MSG

	constructor(public fb: FormBuilder,
		private toastrService: ToastrService,
		public router: Router,
		private validator: FormValidatorService,
		public authService: AuthService,
		private loaderservice: LoaderService,
		private messageService: MessageService,
		public route: ActivatedRoute,
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.titleService.setTitle("TDX Launchpad | Change Password");
		this.createchangePasswordForm();
		this.route.params.subscribe((params) => {
			if (params['token']) {
				this.token = params['token'];
				this.verifyRequest();
			} else {
				this.router.navigate(['auth']);
			}
		})
	}

	/**
	 * @description: used to create change password form
	 */
	createchangePasswordForm() {
		this.changePasswordForm = this.fb.group({
			newPassword: new FormControl('', [Validators.required,noWhitespaceValidator, Validators.minLength(8), Validators.maxLength(40)]),
			confirmPassword: new FormControl('', [Validators.required]),
		})
	}
	get newPassword() { return this.changePasswordForm.get('newPassword'); }
	get confirmPassword() { return this.changePasswordForm.get('confirmPassword'); }

	/**
	 * @description: used to verify forgot password link token
	 */
	verifyRequest() {
		this.loaderservice.show();
		this.authService.verifyForgotPasswordLink(this.token).subscribe((res: any) => {
			this.loaderservice.hide();
			if (res.error) {
				this.toastrService.clear();
				this.toastrService.error(res.message, this.constants.ERROR, {
					timeOut: 5000,
				});
				let that = this;
				setTimeout(function () {
					that.router.navigate(['auth/password-changed']);
				}, 1000)
			} else {
				console.log('link is valid');
			}
		}, err => {
			this.loaderservice.hide();
			this.toastrService.clear();
			this.toastrService.error(err.error.message, this.constants.ERROR, {
				timeOut: 5000,
			});
			let that = this;
			setTimeout(function () {
				that.router.navigate(['auth']);
			}, 1000)
		});
	}

	/**
	 * @description: used to check password and confirm password match validation 
	 */
	checkConfirmPass() {
		this.messageService.error('');
		if (this.newPassword.value && this.confirmPassword.value) {
			if (this.newPassword.value != this.confirmPassword.value) {
				this.messageService.error(this.constants.CONFIRM_PASSWORD_MISMATCH);
			}
			else {
				this.messageService.error('')
			}
		}
	}

	/**
	 * @description: used to change password
	 * @param value new password & confirm password
	 */
	changePassword(value) {
		if (this.changePasswordForm.invalid) {
			this.validator.markControlsTouched(this.changePasswordForm)
			return;
		}
		if (value.newPassword != value.confirmPassword) {
			this.messageService.error(this.constants.CONFIRM_PASSWORD_MISMATCH);
			return;
		} else {
			this.messageService.error('');
		}
		value.token = this.token;
		value.newPassword = btoa(value.newPassword);
		value.confirmPassword = btoa(value.confirmPassword);
		this.loaderservice.show();
		this.authService.changeForgotPasswordOtp(value).subscribe((res: any) => {
			this.loaderservice.hide();
			if (res.error) {
				this.toastrService.clear();
				this.toastrService.error(res.message, this.constants.ERROR, {
					timeOut: 5000,
				});
			} else {
				
					this.router.navigate(['auth/password-changed']);
				
			}
		}, err => {
			this.loaderservice.hide();
			this.messageService.error(err.error.message);
		});
	}

	/**
	 * @description: used to show/hide password
	 */
	handleShowPassword() {
		console.log(this.showPassword)
		this.showPassword = !this.showPassword
	}

	/**
	 * @description: used to show/hide confirm password
	 */
	handleShowConPassword() {
		this.showConPassword = !this.showConPassword
	}
}
