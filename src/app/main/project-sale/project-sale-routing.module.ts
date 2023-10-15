import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectPubmicSaleComponent } from './project-pubmic-sale/project-pubmic-sale.component';


const routes: Routes = [
	{
		path: '', component: ProjectPubmicSaleComponent, children: [
			{ path: '**', redirectTo: 'launchpad', }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectSaleRoutingModule { }
