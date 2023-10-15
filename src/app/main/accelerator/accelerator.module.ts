import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceleratorRoutingModule } from './accelerator-routing.module';
import { AcceleratorComponent } from './accelerator.component';
import { NgbPaginationModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomeComponent } from './home/home.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';


@NgModule({
  declarations: [AcceleratorComponent, HomeComponent],
  imports: [
    CommonModule,
    AcceleratorRoutingModule,
    NgbPaginationModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CarouselModule,
	  NgbModule,
  
  ]
})
export class AcceleratorModule { }
