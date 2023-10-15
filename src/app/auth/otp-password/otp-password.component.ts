import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonApiService, FormValidatorService, LoaderService } from 'src/app/shared/services';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookiesService } from 'src/app/shared/services/cookies.service';
import { Title } from '@angular/platform-browser';
import { Messages } from 'src/app/config/message';

@Component({
  selector: 'app-otp-password',
  templateUrl: './otp-password.component.html',
  styleUrls: ['./otp-password.component.css']
})
export class OtpPasswordComponent implements OnInit {
/**Form Group */
public otpForm: FormGroup;
/**Constant */
constants = Messages.CONST_MSG;
otpSettings = {
	allowNumbersOnly: true,
	length: 6,
	inputStyles: {
		'margin-left': '10px',
		'margin-bottom': '20px'
	}
}
  constructor(
		private toastrService: ToastrService,
		public fb: FormBuilder,
		public router: Router,
		public authService: AuthService,
		private cookieService: CookiesService,
		private loaderservice: LoaderService,
		private titleService: Title,
		public shared: CommonApiService,
		public validator: FormValidatorService
  ) { }

  ngOnInit(): void {
	this.titleService.setTitle("TDX Launchpad | Verify OTP");
		this.createForm();
  }
  /**
   * @description: used to create otp form
   */
  createForm() {
	this.otpForm = this.fb.group({
		otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
	})
  }

  get otp() { return this.otpForm.get('otp'); }

/**
 * @description: used to verify otp
 * @param value otp entered
 */
verifyOtp(value) {
	if (this.otpForm.invalid) {
		this.validator.markControlsTouched(this.otpForm)
		return;
	}
	value.email = this.cookieService.get('otp-email');
	this.loaderservice.show();
	this.authService.verifyOtp(value).subscribe((res: any) => {
		this.loaderservice.hide();
		if (res.error) {
			this.toastrService.clear()
			this.toastrService.error(res.message);
		} else {
			this.toastrService.success(this.constants.VERIFICATION_SUCCESSFULL, this.constants.SUCCESS, { timeOut: 2000 })
			this.cookieService.deleteCookie('otp-email');
			this.cookieService.setCookie('firsttimelogin', true, 365);
			this.completeUserProfile()
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
			this.logInUser()
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
 * @description: used to resend email for otp
 */
resendEmail() {
	let email = this.cookieService.get('otp-email');
	this.loaderservice.show();
	this.authService.sendSignupOtp({ email: email, resend: true }).subscribe((res: any) => {
		this.loaderservice.hide();
		if (res.error) {
			this.toastrService.clear();
			this.toastrService.error(res.message);
		} else {
			this.toastrService.success(this.constants.PLEASE_CHECK_YOUR_EMAIL, this.constants.SUCCESS, { timeOut: 2000 });
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
 * @description: on input change function of otp input
 * @param otp 
 */
  onOtpChange(otp) {
    console.log(otp)
	this.otp.patchValue(otp);
	console.log(this.otp.value)
  }
}
