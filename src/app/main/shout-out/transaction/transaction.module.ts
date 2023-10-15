import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionsListingComponent } from './transactions-listing/transactions-listing.component';
import { ActivityLogsListingComponent } from './activity-logs-listing/activity-logs-listing.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RaiseIssueComponent } from './raise-issue/raise-issue.component';


@NgModule({
	declarations: [TransactionsListingComponent, ActivityLogsListingComponent, TransactionComponent, RaiseIssueComponent],
	imports: [
		CommonModule,
		SharedModule,
		TransactionRoutingModule,
		NgbPaginationModule,
		NgbModalModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule
	]
})
export class TransactionModule { }
