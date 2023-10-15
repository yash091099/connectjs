import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoutOutComponent } from './shout-out/shout-out.component';
import { YoutubeWatchComponent } from './youtube-watch/youtube-watch.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
const routes: Routes = [
	{ path: '', component: ShoutOutComponent, pathMatch: 'full' },
	{ path: 'youtube-watch', component: YoutubeWatchComponent, pathMatch: 'full' },
	{ path: 'transaction', loadChildren: './transaction/transaction.module#TransactionModule' },
	{path: ':sponsor',component: ShoutOutComponent},
	{ path: 'social/:test', component: ShoutOutComponent },
	{ path: 'project/:projectName/:projectId', component: ProjectDetailsComponent },
	{ path: 'project/:projectName/:projectId/:sponsor', component: ProjectDetailsComponent },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ShoutOutRoutingModule { }
