import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { KycComponent } from './kyc/kyc.component';
import { WebcamModule } from 'ngx-webcam';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { GaugeChartModule } from 'angular-gauge-chart';
import { TelegramLoginComponent } from './telegram-login/telegram-login.component'
import { NgOtpInputModule } from  'ng-otp-input';
import { MetamaskComponent } from './metamask/metamask.component';
@NgModule({
	declarations: [EditProfileComponent, KycComponent, TelegramLoginComponent, MetamaskComponent],
	imports: [
		CommonModule,
		SettingsRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		WebcamModule,
		NgbModule,
		NgApexchartsModule,
		GaugeChartModule,
		NgOtpInputModule
	]
})
export class SettingsModule { }
