import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbPaginationModule, NgbModalModule, NgbModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ShoutOutRoutingModule } from './shout-out-routing.module';
import { ShoutOutComponent } from './shout-out/shout-out.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelegramLoginComponent } from './telegram-login/telegram-login.component';
import { AvatarModule } from 'ngx-avatar';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxTweetModule } from "ngx-tweet";
@NgModule({
	declarations: [ShoutOutComponent, TelegramLoginComponent, ProjectDetailsComponent],
	imports: [
		CommonModule,
		SharedModule,
		NgbProgressbarModule,
		NgbPaginationModule,
		NgbModalModule,
		NgbModule,
		ShoutOutRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		AvatarModule,
		NgbTooltipModule,
		NgxTweetModule,
		NgCircleProgressModule.forRoot({})
	]
})
export class ShoutOutModule { }
