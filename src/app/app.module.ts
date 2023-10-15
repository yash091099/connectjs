import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { jwtConfig, SharedModule } from './shared/shared.module';
import { CommonApiService, AppInterceptorService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { WebcamModule } from 'ngx-webcam';
import { AngularOtpLibModule } from 'angular-otp-box';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SimpleSmoothScrollModule } from 'ng2-simple-smooth-scroll';
import { PromotionPageComponent } from './promotion-page/promotion-page.component';
import { AvatarModule } from 'ngx-avatar';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TwitterHtmlComponent } from './twitter-html/twitter-html.component';

export const httpInterceptorProvider = [
	{
		provide: HTTP_INTERCEPTORS,
		useClass: AppInterceptorService,
		multi: true
	},
];

@NgModule({
	declarations: [
		AppComponent,
		LoaderComponent,
		FaqComponent,
		PrivacyPolicyComponent,
		PromotionPageComponent,
		TermsAndConditionsComponent,
		TwitterHtmlComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		CommonModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,

		ToastrModule.forRoot(
			{
				maxOpened: 1,
				autoDismiss: true,

			}
		),
		SharedModule.forRoot(),
		JwtModule.forRoot(jwtConfig),
		NgbModule,
		WebcamModule,
		ChartsModule,
		PdfViewerModule,
		AngularOtpLibModule,
		SimpleSmoothScrollModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), //this is the module for form incase form validation
		AvatarModule,
		NgCircleProgressModule
	],
	providers: [
		CommonApiService,
		CookieService,
		httpInterceptorProvider,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
