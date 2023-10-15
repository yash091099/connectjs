import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferEarnComponent } from './refer-earn/refer-earn.component';
import { ReferralCampaignsComponent } from './referral-campaigns/referral-campaigns.component';
import { ReferComponent } from './refer.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ReferralBannerComponent } from './referral-banner/referral-banner.component';
const routes: Routes = [
  { path: '', component: ReferComponent, pathMatch: 'full' },
  { path: ':tab', component: ReferComponent },
  { path: 'referral-banner', component: ReferralBannerComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferRoutingModule { }
