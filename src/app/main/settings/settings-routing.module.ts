import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { KycComponent } from './kyc/kyc.component';
import { MetamaskComponent } from './metamask/metamask.component';


const routes: Routes = [
	{ path: '', redirectTo: 'kyc', pathMatch: 'full' },
	{ path: 'profile', component: EditProfileComponent, pathMatch: 'full' },
	{ path: 'kyc', component: KycComponent, pathMatch: 'full' },
	{ path: 'kyc/:id', component: KycComponent, pathMatch: 'full' },
	{ path: 'wallet', component: MetamaskComponent, pathMatch: 'full' },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SettingsRoutingModule { }
