import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { WalletModule } from './wallet/wallet.module';
import { StartupModule } from './startup/startup.module';
import { AvatarModule } from 'ngx-avatar';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';
import { TokenTransactionComponent } from './token-transaction/token-transaction.component';

@NgModule({
	declarations: [MainComponent, SidebarComponent, HeaderComponent, FooterComponent,TermsConditionsComponent, TokenTransactionComponent],
	imports: [
		CommonModule,
		MainRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		NgbPaginationModule,
		ChartsModule,
		PdfViewerModule,
		NgbModule,
		SharedModule,
		WalletModule,
		StartupModule,
		AvatarModule,
		NgCircleProgressModule
	]
})
export class MainModule { }
