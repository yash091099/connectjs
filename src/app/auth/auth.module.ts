import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileCompleteComponent } from './profile-complete/profile-complete.component';
import { AuthComponent } from './auth.component';
import { AllSignupComponent } from './all-signup/all-signup.component';
import { AuthService } from './services/auth.service';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialComponent } from './social/social.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { AngularOtpLibModule } from 'angular-otp-box';
import { OtpPasswordComponent } from './otp-password/otp-password.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { CheckEmailComponent } from './check-email/check-email.component';
import { PasswordChangedComponent } from './password-changed/password-changed.component';

@NgModule({
  declarations: [LoginComponent, ForgetPasswordComponent, ChangePasswordComponent, ProfileCompleteComponent, AuthComponent, AllSignupComponent, SocialComponent, OtpPasswordComponent, CheckEmailComponent, PasswordChangedComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    AngularOtpLibModule,
    NgOtpInputModule,
	NgbModule
    
  ],
  providers: [AuthService,]
})
export class AuthModule { }
