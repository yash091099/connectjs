import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGaurdService as AuthGuard } from '../shared/services';
import { FaqComponent } from '../faq/faq.component';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { TokenTransactionComponent } from './token-transaction/token-transaction.component';

const routes: Routes = [
	{
		path: '', component: MainComponent, children: [
			{ path: '', redirectTo: 'launchpad' },
			{ path: 'launchpad', canActivate: [AuthGuard], canActivateChild: [AuthGuard], loadChildren: './accelerator/accelerator.module#AcceleratorModule' },
			{ path: 'project-sale', canActivate: [AuthGuard], canActivateChild: [AuthGuard], loadChildren: './project-sale/project-sale.module#ProjectSaleModule' },
			{ path: 'faq', component: FaqComponent},
			{ path: 'terms-conditions', component: TermsConditionsComponent, },
			{ path: 'privacy-policy', component: PrivacyPolicyComponent, },
			{ path: 'settings', canActivate: [AuthGuard], canActivateChild: [AuthGuard], loadChildren: './settings/settings.module#SettingsModule' },
			{ path: 'wallet', canActivate: [AuthGuard], canActivateChild: [AuthGuard], loadChildren: './wallet/wallet.module#WalletModule' },
			{ path: 'launchpad/startup', canActivate: [AuthGuard], canActivateChild: [AuthGuard], loadChildren: './startup/startup.module#StartupModule' },
			{ path: 'refer', canActivate: [AuthGuard], canActivateChild: [AuthGuard], loadChildren: './refer/refer.module#ReferModule' },
			{ path: 'shout-out', canActivate: [AuthGuard], canActivateChild: [AuthGuard], loadChildren: './shout-out/shout-out.module#ShoutOutModule' },
			{ path: 'transaction', canActivate: [AuthGuard], canActivateChild: [AuthGuard], component: TokenTransactionComponent, },
			{ path: '**', redirectTo: 'launchpad', }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MainRoutingModule { }
