import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionComponent } from './transaction/transaction.component';


const routes: Routes = [
	{ path: '', redirectTo: 'transactions', pathMatch: 'full' },
	{ path: 'transactions', component: TransactionComponent, pathMatch: 'full' },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TransactionRoutingModule { }
