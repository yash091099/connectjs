import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcceleratorComponent } from './accelerator.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
	// 
	{
		path: '', component: AcceleratorComponent, children: [
			{ path: '', redirectTo: 'home' },
			{ path: 'home',  component: HomeComponent },			
			{ path: '**', redirectTo: 'launchpad', }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcceleratorRoutingModule { }
