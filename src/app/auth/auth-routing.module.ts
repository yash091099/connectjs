import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileCompleteComponent } from './profile-complete/profile-complete.component';
import { AllSignupComponent } from './all-signup/all-signup.component';
import { AuthComponent } from './auth.component';
import { LoginGaurdService as LoginGuard } from '../shared/services';
import { SocialComponent } from './social/social.component';
import { OtpPasswordComponent } from './otp-password/otp-password.component';
import { CheckEmailComponent } from './check-email/check-email.component';
import { PasswordChangedComponent } from './password-changed/password-changed.component';
const routes: Routes = [
  // 
  {
    path: '', component: AuthComponent, canActivate: [LoginGuard], children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'login/:sponsor', component: LoginComponent },
      { path: 'login/:data', component: LoginComponent },
      { path: 'login/:data/:type', component: LoginComponent },
      { path: 'adminlogin/:data', component: LoginComponent },
      { path: 'social/:data', component: SocialComponent },
      { path: 'all-signup', component: AllSignupComponent },
      {path: 'verification-complete', component: CheckEmailComponent},
      {path: 'password-changed', component: PasswordChangedComponent},
      { path: 'all-signup/:sponsor', component: AllSignupComponent },
      { path: 'complete-profile', component: ProfileCompleteComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      { path: 'change-password/:token', component: ChangePasswordComponent },
      { path: 'otp-verification', component: OtpPasswordComponent },      
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
