import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionPageComponent } from './promotion-page/promotion-page.component';
import { AuthGaurdService as AuthGuard } from './shared/services';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TwitterHtmlComponent } from './twitter-html/twitter-html.component';
import { KycVerifyComponent } from './shared/components/kyc-verify/kyc-verify.component';

const routes: Routes = [
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'promote/:pageId/:referralId', component: PromotionPageComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'twitter/:id', component: TwitterHtmlComponent },
  { path: 'twitter/:id', component: TwitterHtmlComponent },
	{path: 'kyc-verification', component: KycVerifyComponent },
  { path: '',  loadChildren: './main/main.module#MainModule' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
