import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { StartupRoutingModule } from './startup-routing.module';
import { StartupDetailsComponent } from './startup-details/startup-details.component';
import { StartupParticipationDetailsComponent } from './startup-participation-details/startup-participation-details.component';
import { PoolCardComponent } from './pool-card/pool-card.component';
import { NgbPaginationModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ StartupDetailsComponent, StartupParticipationDetailsComponent, PoolCardComponent],
  imports: [
    CommonModule,
    StartupRoutingModule,FormsModule,ReactiveFormsModule,SharedModule,NgbPaginationModule,NgbModalModule,NgbModule
  ]
})
export class StartupModule { }
