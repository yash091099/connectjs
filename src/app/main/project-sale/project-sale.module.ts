import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { ProjectSaleRoutingModule } from './project-sale-routing.module';
import { ProjectPubmicSaleComponent } from './project-pubmic-sale/project-pubmic-sale.component';


@NgModule({
  declarations: [ProjectPubmicSaleComponent],
  imports: [
    CommonModule,
    ProjectSaleRoutingModule,
    NgbPaginationModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CarouselModule,
	  NgbModule,
  ]
})
export class ProjectSaleModule { }
