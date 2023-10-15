import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions/transactions.component';
import { NewWithdrawComponent } from './new-withdraw/new-withdraw.component';

const routes: Routes = [
	{ path: '', redirectTo: 'withdrawals', pathMatch: 'full' },
	{ path: 'transactions', component: TransactionsComponent, pathMatch: 'full' },
	{ path: 'transactions/:data', component: TransactionsComponent, pathMatch: 'full' },
	{ path: 'withdrawals', component: NewWithdrawComponent, pathMatch: 'full' },
	
	{ path: '**', redirectTo: 'deposits', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class WalletRoutingModule { }
