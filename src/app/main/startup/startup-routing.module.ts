import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartupDetailsComponent } from './startup-details/startup-details.component';
import { StartupParticipationDetailsComponent } from './startup-participation-details/startup-participation-details.component';

const routes: Routes = [
	{ path: '', redirectTo: 'details', pathMatch: 'full' },
	{ path: 'details/:id/:roundId', component: StartupDetailsComponent, pathMatch: 'full' },
	{ path: 'participations/:id/:roundId', component: StartupParticipationDetailsComponent, pathMatch: 'full' },
	
	{ path: '**', redirectTo: 'details', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartupRoutingModule { }
