import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormValidatorService, LoaderService, MessageService } from 'src/app/shared/services';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { Messages } from 'src/app/config/message';
import forbiddenEmailValidation from 'src/app/shared/services/email-validator.service';

@Component({
	selector: 'app-forget-password',
	templateUrl: './forget-password.component.html',
	styleUrls: ['./forget-password.component.css']
})

export class ForgetPasswordComponent implements OnInit {
	/**Form Group */
	public forgetpasswordForm: FormGroup;
	/**Constant */
	constants = Messages.CONST_MSG;

	constructor(
		private toastrService: ToastrService,
		public fb: FormBuilder,
		public router: Router,
		private validator: FormValidatorService,
		public authService: AuthService,
		private loaderservice: LoaderService,
		private messageService: MessageService,
		private titleService: Title
	) { }

	ngOnInit(): void {
		this.titleService.setTitle("TDX Launchpad | Forget Password");
		this.createForm();
	}

	/**
	 * @description: used to create forget password form
	 */
	createForm() {
		this.forgetpasswordForm = this.fb.group({
			email: new FormControl('', [Validators.required, forbiddenEmailValidation]),
		})
	}
	get email() { return this.forgetpasswordForm.get('email'); }

	/**
	 * @description: used to forget password 
	 * @param value user's email
	 */
	sendOtp(value) {
		if (this.forgetpasswordForm.invalid) {
			this.validator.markControlsTouched(this.forgetpasswordForm)
			return;
		}
		this.loaderservice.show();
		this.authService.sendForgotPasswordOtp(value).subscribe((res: any) => {
			this.loaderservice.hide();
			if (res.error) {
				this.toastrService.clear();
				this.toastrService.error(res.message, this.constants.ERROR, {
					timeOut: 5000,
				});
			} else {
				this.router.navigate(['auth/verification-complete']);
			}
		}, err => {
			this.loaderservice.hide();
			this.messageService.error(err.error.message);
		});
	}

	/**
	 * @description: on change function of email and used to reset 
	 */
	resetError() {
		this.messageService.error('');
	}
}
