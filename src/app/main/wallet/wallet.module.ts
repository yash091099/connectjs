import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { DepositComponent } from './deposit/deposit.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WithdrawalsComponent } from './withdrawals/withdrawals.component';
import { NewWithdrawComponent } from './new-withdraw/new-withdraw.component';
import { TransactionsComponent } from './transactions/transactions/transactions.component';

@NgModule({
	declarations: [WalletComponent, DepositComponent, PurchaseComponent, InvoiceComponent, WithdrawalsComponent, NewWithdrawComponent, TransactionsComponent],
	imports: [
		CommonModule,
		WalletRoutingModule,
		FormsModule,
		NgbPaginationModule,
		ReactiveFormsModule,
		SharedModule,
		NgbTooltipModule,
		NgbModule

	]
})
export class WalletModule { }
