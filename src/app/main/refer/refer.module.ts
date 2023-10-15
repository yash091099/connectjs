import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferRoutingModule } from './refer-routing.module';
import { ReferEarnComponent } from './refer-earn/refer-earn.component';
import { ReferComponent } from './refer.component';
import { ReferralCampaignsComponent } from './referral-campaigns/referral-campaigns.component';
import { NgbModule, NgbTooltipModule , NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReferralBannerComponent } from './referral-banner/referral-banner.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [ReferEarnComponent, ReferComponent, ReferralCampaignsComponent, AnalyticsComponent, ReferralBannerComponent],
	imports: [
		CommonModule,
		ReferRoutingModule,
		NgbModule,
		NgbTooltipModule,
		NgbDropdownModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		RouterModule
	]
})
export class ReferModule { }
